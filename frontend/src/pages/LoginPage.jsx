import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from '../context/RouterContext';
import { useAuth } from '../auth';
import { sendOtp, verifyOtp } from '../auth/authService';
import {
  Panel,
  PanelContent,
  Input,
  Button,
} from '../components/common';

const RESEND_COOLDOWN_SECONDS = 30;

export function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithOtp, loginAsGuest } = useAuth();

  // If already authenticated on load, redirect to assistant cleanly
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/assistant', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Screen flow steps: 'IDENTIFIER' | 'OTP'
  const [step, setStep] = useState('IDENTIFIER');

  // Input states
  const [identifier, setIdentifier] = useState('');
  const [maskedIdentifier, setMaskedIdentifier] = useState('');
  const [otp, setOtp] = useState('');

  // Button-level loading states
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Inline error states
  const [identifierError, setIdentifierError] = useState('');
  const [otpError, setOtpError] = useState('');

  // 30s resend cooldown timer
  const [cooldown, setCooldown] = useState(0);

  // Screen reader announcements for state transitions
  const [liveAnnouncement, setLiveAnnouncement] = useState('');

  // Input focus refs
  const identifierInputRef = useRef(null);
  const otpInputRef = useRef(null);

  // Manage resend cooldown timer
  useEffect(() => {
    let timer = null;
    if (step === 'OTP' && cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setLiveAnnouncement('Resend code is now available.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, cooldown]);

  // Focus OTP input when OTP step appears
  useEffect(() => {
    if (step === 'OTP' && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [step]);

  // Handle identifier field changes
  const handleIdentifierChange = (e) => {
    setIdentifier(e.target.value);
    if (identifierError) setIdentifierError('');
  };

  // Handle OTP field changes (numeric only, max 6 digits)
  const handleOtpChange = (e) => {
    const numeric = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(numeric);
    if (otpError) setOtpError('');
  };

  // STEP 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (isSendingOtp) return;

    setIdentifierError('');

    try {
      setIsSendingOtp(true);
      const result = await sendOtp(identifier);
      setMaskedIdentifier(result.maskedIdentifier);
      setStep('OTP');
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setOtp('');
      setOtpError('');
      setLiveAnnouncement(`A 6-digit code was sent to ${result.maskedIdentifier}. Please enter the code.`);
    } catch (err) {
      setIdentifierError(err.message);
      setLiveAnnouncement(err.message);
      identifierInputRef.current?.focus();
    } finally {
      setIsSendingOtp(false);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (isVerifying) return;

    setOtpError('');

    try {
      setIsVerifying(true);
      const result = await verifyOtp(identifier, otp);
      loginWithOtp(result.session.identifier);
      navigate('/assistant');
    } catch (err) {
      setOtpError(err.message);
      setLiveAnnouncement(err.message);
      otpInputRef.current?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  // Resend code action
  const handleResendCode = async () => {
    if (cooldown > 0 || isResending) return;

    try {
      setIsResending(true);
      setOtpError('');
      const result = await sendOtp(identifier);
      setMaskedIdentifier(result.maskedIdentifier);
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setOtp('');
      setLiveAnnouncement('A new verification code has been dispatched.');
    } catch (err) {
      setOtpError(err.message);
      setLiveAnnouncement(err.message);
    } finally {
      setIsResending(false);
    }
  };

  // Return to Identifier step cleanly
  const handleChangeIdentifier = useCallback(() => {
    setStep('IDENTIFIER');
    setOtp('');
    setOtpError('');
    setTimeout(() => {
      identifierInputRef.current?.focus();
    }, 50);
  }, []);

  // Continue as Guest (instant navigation, no verification, no delay)
  const handleContinueAsGuest = () => {
    loginAsGuest();
    navigate('/assistant');
  };

  return (
    <div className="auth-page-wrapper">
      {/* Screen reader live region for announcing dynamic changes */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveAnnouncement}
      </div>

      <div className="ui-container auth-panel-container">
        {/* H1 Heading and single short line beneath */}
        <div className="auth-header">
          <h1>Sign in to continue</h1>
          <p>Enter your mobile number or email to receive a one-time code.</p>
        </div>

        {/* Single bordered Panel (max-width ~480px) */}
        <Panel>
          <PanelContent style={{ padding: '24px' }}>
            {step === 'IDENTIFIER' ? (
              /* ==========================================================
                 IDENTIFIER SCREEN
                 ========================================================== */
              <div>
                <form onSubmit={handleSendOtp} noValidate>
                  <Input
                    ref={identifierInputRef}
                    label="Mobile number or email"
                    id="auth-identifier"
                    name="identifier"
                    type="text"
                    value={identifier}
                    onChange={handleIdentifierChange}
                    placeholder="e.g. 9876543210 or name@example.com"
                    helperText="Enter a 10-digit mobile number or an email address."
                    error={identifierError}
                    required
                    requiredText="(required)"
                    autoComplete="username tel email"
                    disabled={isSendingOtp}
                    autoFocus
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isSendingOtp}
                    disabled={isSendingOtp}
                    style={{ width: '100%', marginTop: '16px' }}
                  >
                    {isSendingOtp ? 'Sending...' : 'Send OTP'}
                  </Button>
                </form>

                <div className="auth-divider" role="separator" aria-label="Alternative sign-in option">
                  <span className="auth-divider__text">or</span>
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={handleContinueAsGuest}
                  style={{ width: '100%' }}
                >
                  Continue as Guest
                </Button>
              </div>
            ) : (
              /* ==========================================================
                 OTP VERIFICATION SCREEN (Replaces form inside same panel)
                 ========================================================== */
              <div>
                <h2
                  style={{
                    fontSize: 'var(--font-size-h2)',
                    fontWeight: '600',
                    color: 'var(--color-primary)',
                    marginTop: 0,
                    marginBottom: '8px',
                  }}
                >
                  Enter the code
                </h2>

                <p style={{ fontSize: '15px', color: 'var(--color-text-primary)', margin: '0 0 4px 0' }}>
                  A 6-digit code was sent to {maskedIdentifier}.
                </p>

                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 20px 0' }}>
                  Demo mode: any 6-digit code is accepted. No SMS or email is sent.
                </p>

                <form onSubmit={handleVerifyOtp} noValidate>
                  <Input
                    ref={otpInputRef}
                    label="6-digit code"
                    id="auth-otp"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    autoComplete="one-time-code"
                    placeholder="123456"
                    value={otp}
                    onChange={handleOtpChange}
                    error={otpError}
                    required
                    requiredText="(required)"
                    disabled={isVerifying}
                    className="auth-otp-input"
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isVerifying}
                    disabled={isVerifying}
                    style={{ width: '100%', marginTop: '16px' }}
                  >
                    {isVerifying ? 'Verifying...' : 'Verify & Continue'}
                  </Button>
                </form>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    marginTop: '16px',
                    alignItems: 'center',
                  }}
                >
                  <button
                    type="button"
                    className="auth-text-link-btn"
                    disabled={cooldown > 0 || isResending}
                    onClick={handleResendCode}
                  >
                    {cooldown > 0
                      ? `Resend code in ${cooldown}s`
                      : isResending
                      ? 'Sending...'
                      : 'Resend code'}
                  </button>

                  <button
                    type="button"
                    className="auth-text-link-btn"
                    onClick={handleChangeIdentifier}
                  >
                    Change mobile number or email
                  </button>
                </div>

                <div className="auth-divider" role="separator" aria-label="Alternative sign-in option">
                  <span className="auth-divider__text">or</span>
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={handleContinueAsGuest}
                  style={{ width: '100%' }}
                >
                  Continue as Guest
                </Button>
              </div>
            )}
          </PanelContent>
        </Panel>
      </div>
    </div>
  );
}
