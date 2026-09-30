import { useState } from 'react';
import { Link, useNavigate } from '../context/RouterContext';
import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Button,
  UserIcon,
} from '../components/common';

export function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [institution, setInstitution] = useState('');
  const [role, setRole] = useState('Researcher');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password || !institution) {
      setError('Please fill in all mandatory institutional profile fields.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/assistant');
    }, 600);
  };

  return (
    <div style={{ padding: '40px 0 60px' }}>
      <Container size="sm">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ marginBottom: '8px' }}>
            Register Institutional Account
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 }}>
            Establish access credentials for research teams, patent counsel, and ASU manufacturers.
          </p>
        </div>

        <Card>
          <CardHeader bordered>
            <CardTitle>Organization &amp; Practitioner Details</CardTitle>
            <CardDescription>
              All accounts are verified against authorized statutory directories in production.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit} noValidate>
            <CardContent>
              {error && (
                <div
                  className="ui-form-error"
                  style={{
                    padding: '10px 12px',
                    backgroundColor: 'var(--color-status-error-bg)',
                    border: '1px solid var(--color-status-error-border)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '16px',
                  }}
                  role="alert"
                >
                  {error}
                </div>
              )}

              <Input
                label="Full Name of Practitioner / Researcher"
                id="register-name"
                name="name"
                type="text"
                placeholder="Dr. Rajesh Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                iconLeft={<UserIcon size={16} />}
                required
              />

              <Input
                label="Institution, University, or Patent Firm"
                id="register-institution"
                name="institution"
                type="text"
                placeholder="e.g., National Institute of Ayurveda / R&D Division"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                required
              />

              <div className="ui-form-group">
                <label htmlFor="register-role" className="ui-label">
                  Professional Practice Domain
                </label>
                <div className="ui-input-wrapper">
                  <select
                    id="register-role"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="ui-input"
                  >
                    <option value="Researcher">Ayurvedic Academic / R&amp;D Scientist</option>
                    <option value="PatentAttorney">Patent Attorney / IP Examiner</option>
                    <option value="Manufacturer">ASU Pharmaceutical Manufacturer</option>
                    <option value="RegulatoryOfficer">Ayush Regulatory Compliance Officer</option>
                  </select>
                </div>
              </div>

              <Input
                label="Institutional Email Address"
                id="register-email"
                name="email"
                type="email"
                placeholder="practitioner@institution.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Create Security Password"
                id="register-password"
                name="password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                helperText="Use at least 8 characters with numbers and symbols."
                required
              />
            </CardContent>

            <CardFooter bordered style={{ justifyContent: 'space-between' }}>
              <Link to="/login" style={{ fontSize: '13px' }}>
                Existing user? Sign In
              </Link>
              <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
                Complete Registration
              </Button>
            </CardFooter>
          </form>
        </Card>
      </Container>
    </div>
  );
}
