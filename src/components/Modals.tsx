import { useSettingsStore } from "../store/settingsStore";
import { useQueueStore } from "../store/queueStore";
import { Dialog, DialogBackdrop } from "./Dialog";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, CheckmarkCircle02Icon, Logout01Icon, QrCodeIcon, Directions01Icon, Call02Icon } from "@hugeicons/core-free-icons";
import { Button } from "./Button";

export function Modals() {
  const {
    showLeaveDialog,
    setShowLeaveDialog,
    showCancelDialog,
    setShowCancelDialog,
    showQrTicket,
    setShowQrTicket,
    showDirectionsModal,
    setShowDirectionsModal,
    showPersonalDetailsModal,
    setShowPersonalDetailsModal,
    showLanguageModal,
    setShowLanguageModal,
    showAccessibilityModal,
    setShowAccessibilityModal,
    showHelpModal,
    setShowHelpModal,
    showSignOutModal,
    setShowSignOutModal,
    notify,
  } = useSettingsStore();

  const {
    setActive,
    setSelectedPastAppt,
    selectedPastAppt,
  } = useQueueStore();

  return (
    <>
      {/* Leave queue dialog */}
      {showLeaveDialog && (
        <DialogBackdrop onClose={() => setShowLeaveDialog(false)}>
          <Dialog onClose={() => setShowLeaveDialog(false)} title="Leave digital queue?">
            <p className="text-center text-xs">
              You will forfeit your spot (OPD-024).
            </p>
            <div className="stack pt-2">
              <Button
                variant="danger"
                onClick={() => {
                  setActive(false);
                  setShowLeaveDialog(false);
                  notify("Left queue");
                }}
              >
                Leave queue
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowLeaveDialog(false)}
              >
                Keep my spot
              </Button>
            </div>
          </Dialog>
        </DialogBackdrop>
      )}

      {/* Cancel booking dialog */}
      {showCancelDialog && (
        <DialogBackdrop onClose={() => setShowCancelDialog(false)}>
          <Dialog onClose={() => setShowCancelDialog(false)} title="Cancel booking?">
            <p className="text-center text-xs">
              This slot will be released back into public schedule.
            </p>
            <div className="stack pt-2">
              <Button
                variant="danger"
                onClick={() => {
                  setShowCancelDialog(false);
                  notify("Booking cancelled");
                }}
              >
                Cancel booking
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowCancelDialog(false)}
              >
                Keep my booking
              </Button>
            </div>
          </Dialog>
        </DialogBackdrop>
      )}

      {/* QR ticket dialog */}
      {showQrTicket && (
        <DialogBackdrop onClose={() => setShowQrTicket(false)}>
          <Dialog
            onClose={() => setShowQrTicket(false)}
            title="Verification Pass"
            showHandle
          >
            <p className="text-xs">Present this QR code at triage desk.</p>
            <div className="p-4 bg-black text-white rounded-2xl flex flex-col items-center gap-2 my-2">
              <div className="bg-white p-2 rounded-xl text-black">
                <HugeiconsIcon icon={QrCodeIcon} size={110} />
              </div>
              <strong className="font-sans text-2xl tracking-widest">
                OPD-024
              </strong>
              <span className="text-[11px] text-neutral-400">Amina Kamau</span>
            </div>
            <Button onClick={() => setShowQrTicket(false)}>Close pass</Button>
          </Dialog>
        </DialogBackdrop>
      )}

      {/* Directions dialog */}
      {showDirectionsModal && (
        <DialogBackdrop onClose={() => setShowDirectionsModal(null)}>
          <Dialog onClose={() => setShowDirectionsModal(null)} title={showDirectionsModal.name}>
            <p className="text-xs">{showDirectionsModal.address}</p>
            <div className="p-3 rounded-2xl bg-neutral-100 text-xs">
              <strong>Public Transit:</strong>
              <p className="mt-1">{showDirectionsModal.transit}</p>
            </div>
            <Button
              variant="secondary"
              onClick={() => {
                window.open(
                  `https://www.google.com/maps/dir/?api=1&destination=${showDirectionsModal.latitude},${showDirectionsModal.longitude}`,
                  "_blank",
                  "noopener,noreferrer",
                );
              }}
              icon={<HugeiconsIcon icon={Directions01Icon} size={18} />}
            >
              Open directions in Google Maps
            </Button>
            <Button onClick={() => setShowDirectionsModal(null)}>Done</Button>
          </Dialog>
        </DialogBackdrop>
      )}

      {/* Personal details dialog */}
      {showPersonalDetailsModal && (
        <DialogBackdrop onClose={() => setShowPersonalDetailsModal(false)}>
          <Dialog
            onClose={() => setShowPersonalDetailsModal(false)}
            title="Edit Details"
            textLeft
          >
            <div className="stack pt-2">
              <Button onClick={() => {
                setShowPersonalDetailsModal(false);
                notify("Details updated");
              }}>Save</Button>
              <Button variant="quiet" onClick={() => setShowPersonalDetailsModal(false)}>
                Cancel
              </Button>
            </div>
          </Dialog>
        </DialogBackdrop>
      )}

      {/* Language dialog */}
      {showLanguageModal && (
        <DialogBackdrop onClose={() => setShowLanguageModal(false)}>
          <Dialog onClose={() => setShowLanguageModal(false)} title="Language">
            <div className="stack">
              <button
                className="p-3 rounded-xl border text-left flex justify-between border-black font-bold"
                onClick={() => {
                  setShowLanguageModal(false);
                  notify("Language: English");
                }}
              >
                <span>English</span>
              </button>
              <button
                className="p-3 rounded-xl border text-left flex justify-between border-neutral-200"
                onClick={() => {
                  setShowLanguageModal(false);
                  notify("Lugha: Kiswahili");
                }}
              >
                <span>Kiswahili</span>
              </button>
            </div>
            <Button variant="quiet" onClick={() => setShowLanguageModal(false)}>
              Close
            </Button>
          </Dialog>
        </DialogBackdrop>
      )}

      {/* Accessibility dialog */}
      {showAccessibilityModal && (
        <DialogBackdrop onClose={() => setShowAccessibilityModal(false)}>
          <Dialog
            onClose={() => setShowAccessibilityModal(false)}
            title="Accessibility"
          >
            <p className="text-xs">
              Adjust how Qlinic looks and announces important updates.
            </p>
            <Button onClick={() => setShowAccessibilityModal(false)}>
              Done
            </Button>
          </Dialog>
        </DialogBackdrop>
      )}

      {/* Help dialog */}
      {showHelpModal && (
        <DialogBackdrop onClose={() => setShowHelpModal(false)}>
          <Dialog onClose={() => setShowHelpModal(false)} title="Help & clinic hotlines">
            <div className="p-3 rounded-xl bg-neutral-100 text-xs">
              <strong>Public health emergency line</strong>
              <p className="text-lg font-bold mt-1">1199</p>
            </div>
            <Button
              onClick={() => {
                window.location.href = "tel:1199";
              }}
              icon={<HugeiconsIcon icon={Call02Icon} size={18} />}
            >
              Call 1199
            </Button>
            <Button variant="secondary" onClick={() => setShowHelpModal(false)}>
              Close
            </Button>
          </Dialog>
        </DialogBackdrop>
      )}

      {/* Past appointment dialog */}
      {selectedPastAppt && (
        <DialogBackdrop onClose={() => setSelectedPastAppt(null as any)}>
          <Dialog
            onClose={() => setSelectedPastAppt(null as any)}
            title="Visit Record"
            textLeft
          >
            <p className="text-xs text-neutral-500">
              {selectedPastAppt.clinic}
            </p>
            <div className="p-3 rounded-xl bg-neutral-100 text-xs stack">
              <div>
                <strong>Date:</strong> {selectedPastAppt.date}
              </div>
              <div>
                <strong>Doctor:</strong> {selectedPastAppt.doctor}
              </div>
              <div>
                <strong>Summary:</strong> {selectedPastAppt.notes}
              </div>
            </div>
            <Button onClick={() => setSelectedPastAppt(null as any)}>Close</Button>
          </Dialog>
        </DialogBackdrop>
      )}

      {/* Sign out dialog */}
      {showSignOutModal && (
        <DialogBackdrop onClose={() => setShowSignOutModal(false)}>
          <Dialog
            onClose={() => setShowSignOutModal(false)}
            title="Sign out?"
            textCenter
          >
            <p className="text-xs">
              You can sign back in at any time with your email address.
            </p>
            <div className="stack pt-2">
              <Button
                variant="danger"
                onClick={() => {
                  setShowSignOutModal(false);
                  notify("Signed out");
                }}
              >
                Sign out
              </Button>
              <Button variant="secondary" onClick={() => setShowSignOutModal(false)}>
                Stay signed in
              </Button>
            </div>
          </Dialog>
        </DialogBackdrop>
      )}
    </>
  );
}
