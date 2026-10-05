import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ShieldAlert,
  LogOut,
  UserCheck
} from 'lucide-react';
import { googleSignIn, initAuth, logout } from '../lib/firebase';
import { sendGmailEmail, fetchGmailProfile, GmailProfile } from '../lib/gmail';
import { UserProfile, DashboardStats } from '../types';
import { User as FirebaseUser } from 'firebase/auth';

interface GmailShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  stats: DashboardStats;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

export const GmailShareModal: React.FC<GmailShareModalProps> = ({
  isOpen,
  onClose,
  user,
  stats,
  onShowToast
}) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [gmailProfile, setGmailProfile] = useState<GmailProfile | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(false);

  // Email form state
  const [recipientEmail, setRecipientEmail] = useState<string>('sustainability.team@eco.org');
  const [subject, setSubject] = useState<string>(`Eco Impact Summary for ${user.name}`);
  const [bodyText, setBodyText] = useState<string>('');

  // Confirmation dialog step
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

  // Initialize Auth Listener on mount
  useEffect(() => {
    const unsubscribe = initAuth((u) => {
      setFirebaseUser(u);
      if (!u) {
        setAccessToken(null);
        setGmailProfile(null);
      }
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Set default body text when modal opens or user stats change
  useEffect(() => {
    if (isOpen) {
      setBodyText(
        `Hello,\n\nHere is my official Eco Impact Report from the AI Green Habit Tracker:\n\n` +
          `• Guardian: ${user.name} (${user.email})\n` +
          `• Total Green Points: ${stats.greenPoints.toLocaleString()} pts\n` +
          `• Verified Tasks Completed: ${stats.completedTasks}\n` +
          `• Estimated CO₂ Saved: ${stats.co2SavedKg} kg\n` +
          `• Active Streak: ${stats.streakDays} Days\n\n` +
          `Together, we are building a greener and more sustainable future!\n\n` +
          `Best regards,\n${user.name}`
      );
    }
  }, [isOpen, user, stats]);

  // Load Gmail profile when access token is acquired
  useEffect(() => {
    if (accessToken) {
      setIsProfileLoading(true);
      fetchGmailProfile(accessToken)
        .then((prof) => {
          setGmailProfile(prof);
        })
        .catch((err) => {
          console.error('Error fetching Gmail profile:', err);
        })
        .finally(() => {
          setIsProfileLoading(false);
        });
    }
  }, [accessToken]);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsAuthenticating(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setFirebaseUser(res.user);
        setAccessToken(res.accessToken);
        onShowToast('Gmail Connected', `Signed in as ${res.user.email}`, 'success');
      }
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      onShowToast('Sign-In Failed', err.message || 'Could not authenticate with Google.', 'error');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOutGoogle = async () => {
    await logout();
    setFirebaseUser(null);
    setAccessToken(null);
    setGmailProfile(null);
    onShowToast('Gmail Disconnected', 'Signed out of Google account.', 'info');
  };

  const handleOpenConfirmDialog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail || !subject || !bodyText) {
      onShowToast('Missing Fields', 'Please fill in recipient, subject, and content.', 'error');
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleSendEmail = async () => {
    if (!accessToken) {
      onShowToast('Auth Required', 'Please connect your Google account first.', 'error');
      return;
    }

    setIsSending(true);
    try {
      await sendGmailEmail(accessToken, recipientEmail, subject, bodyText);
      onShowToast('Email Sent via Gmail! 🚀', `Impact report sent to ${recipientEmail}`, 'success');
      setShowConfirmDialog(false);
      onClose();
    } catch (err: any) {
      console.error('Gmail send error:', err);
      onShowToast('Gmail Dispatch Failed', err.message || 'Unable to send email.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-black text-lg">Gmail Impact Report Dispatch</h2>
              <p className="text-xs text-emerald-100 mt-0.5">
                Share your verified eco statistics via your Gmail account
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Section 1: Gmail OAuth Connection Banner */}
          {!accessToken ? (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 space-y-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  <strong className="font-bold block">Google Gmail Access Required</strong>
                  <p>
                    Connect your Google Account to draft and send impact reports directly via the official Gmail API.
                  </p>
                </div>
              </div>

              {/* Official "Sign in with Google" Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isAuthenticating}
                className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs shadow-sm flex items-center justify-center gap-3 transition cursor-pointer"
              >
                {isAuthenticating ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                )}
                <span>{isAuthenticating ? 'Authenticating with Google...' : 'Sign in with Google'}</span>
              </button>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block">
                    Gmail Connected
                  </span>
                  <strong className="text-slate-900 dark:text-white font-bold">
                    {gmailProfile?.emailAddress || firebaseUser?.email || 'Google Account Active'}
                  </strong>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSignOutGoogle}
                className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                title="Disconnect Google Account"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Section 2: Email Draft Form */}
          <form onSubmit={handleOpenConfirmDialog} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Recipient Email Address
              </label>
              <input
                type="email"
                required
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="e.g. manager@eco.org"
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Subject Line
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Report Content / Message Body
              </label>
              <textarea
                required
                rows={7}
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-emerald-500 leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={!accessToken}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Preview & Confirm Email Dispatch</span>
            </button>
          </form>
        </div>
      </div>

      {/* MANDATORY USER CONFIRMATION DIALOG */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Confirm Gmail Dispatch Action
              </h3>
            </div>

            <p className="text-slate-600 dark:text-slate-300">
              You are about to send an email from your authorized Gmail account. Please confirm the details below:
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 space-y-2 border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">To Recipient</span>
                <strong className="text-slate-900 dark:text-white">{recipientEmail}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Subject</span>
                <strong className="text-slate-900 dark:text-white">{subject}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Message Preview</span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-3 font-mono italic mt-0.5">
                  "{bodyText}"
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSendEmail}
                disabled={isSending}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md transition flex items-center justify-center gap-2"
              >
                {isSending ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>{isSending ? 'Sending...' : 'Confirm & Send'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
