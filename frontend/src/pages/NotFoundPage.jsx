import { Link } from '../context/RouterContext';
import { Container, Button, EmptyState, ArrowRightIcon, AlertCircleIcon } from '../components/common';

export function NotFoundPage() {
  return (
    <div style={{ padding: '60px 0' }}>
      <Container size="sm">
        <EmptyState
          icon={<AlertCircleIcon size={24} style={{ color: 'var(--color-status-error)' }} />}
          title="404 — Page Not Found"
          description="The requested statutory workspace or resource path does not exist in the IP-SAKTI Sahayak directory."
          action={
            <Link to="/">
              <Button variant="primary" size="md" iconRight={<ArrowRightIcon size={16} />}>
                Return to Overview
              </Button>
            </Link>
          }
        />
      </Container>
    </div>
  );
}
