import { Trip, STAGES } from '../data/trips';
import { Strings } from '../i18n/strings';
import { colors } from '../theme/colors';

export function stageLabels(t: Strings): string[] {
  return [t.stRequested, t.stApproved, t.stConfirmed, t.stOnHire, t.stClosed];
}

export function statusFor(tr: Trip, t: Strings): string {
  if (tr.cancelled) return t.stCancelled;
  if (tr.stage === 0) return tr.needsApproval ? t.stAwaitApproval : t.stAwaitBV;
  return stageLabels(t)[tr.stage];
}

// Status badges read as pipeline progress, not alarm — red is reserved for
// "Cancelled" cases that genuinely need it elsewhere, not for every mid-flow
// stage. Awaiting = gold (needs attention), On hire = green (active/good),
// Approved/Confirmed = primary charcoal (calm, in progress), Closed/Cancelled = neutral grey.
export function badgeColors(tr: Trip): { fg: string; bg: string } {
  if (tr.cancelled) return { fg: colors.slate, bg: '#EDEDED' };
  if (tr.stage === 3) return { fg: '#fff', bg: colors.success };
  if (tr.stage === 0) return { fg: colors.ink, bg: colors.gold };
  if (tr.stage === 4) return { fg: colors.slate, bg: '#EDEDED' };
  return { fg: '#fff', bg: colors.primary };
}

export interface TripStep {
  label: string;
  done: boolean;
  current: boolean;
  connectorDone: boolean;
}

export function tripSteps(tr: Trip, t: Strings): TripStep[] {
  const labels = stageLabels(t);
  return STAGES.map((_, i) => ({
    label: labels[i],
    done: !tr.cancelled && i <= tr.stage,
    current: !tr.cancelled && i === tr.stage,
    connectorDone: !tr.cancelled && i < tr.stage,
  }));
}

export function driverInitials(name: string | null): string {
  if (!name) return '';
  return name.split(' ').map((w) => w[0]).join('');
}
