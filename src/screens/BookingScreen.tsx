import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, Tick02Icon, ArrowLeft01Icon, RefreshIcon } from "@hugeicons/core-free-icons";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useClinicStore } from "../store/clinicStore";
import { useQueueStore } from "../store/queueStore";
import { useSettingsStore } from "../store/settingsStore";
import { Button } from "../components/Button";
import { TopBar } from "../components/TopBar";
import { data } from "../data";

export function BookingScreen() {
  const navigate = useNavigate();
  const {
    selectedClinic,
    setSelectedClinic,
  } = useClinicStore();
  const {
    selectedService,
    setSelectedService,
    setQueueNumber,
    setSelectedClinic: setQueueClinic,
    setSelectedService: setQueueService,
  } = useQueueStore();
  const {
    setReturnScreen,
  } = useSettingsStore();

  const [clinics, setClinics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingStep, setBookingStep] = useState(1);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [confirming, setConfirming] = useState(false);

  const availableDates = data.getAvailableDates();
  const availableSlots = data.getAvailableSlots();

  useEffect(() => {
    const load = async () => {
      try {
        const clinicList = await data.getClinics();
        setClinics(clinicList);
        if (clinicList.length > 0 && !selectedClinic) {
          setSelectedClinic(clinicList[0]);
          setSelectedService(clinicList[0].services?.[0] || "General outpatient");
        }
        if (availableDates.length > 0) setDate(availableDates[0]);
        if (availableSlots.length > 0) setTime(availableSlots[0]);
      } catch {
        setClinics([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedClinic]);

  const handleBack = () => {
    if (bookingStep > 1) {
      setBookingStep(bookingStep - 1);
    } else {
      navigate("/home");
    }
  };

  const handleConfirm = async () => {
    setConfirming(true);
    await new Promise((r) => setTimeout(r, 800)); // simulate save
    setQueueNumber("OPD-" + Math.floor(100 + Math.random() * 900));
    if (selectedClinic) setQueueClinic(selectedClinic);
    if (selectedService) setQueueService(selectedService);
    setConfirming(false);
    navigate("/appointment-confirm");
  };

  if (loading) {
    return (
      <main className="content items-center justify-center py-20">
        <span className="t-shimmer" data-text="Loading clinics">
          Loading clinics
        </span>
      </main>
    );
  }

  return (
    <>
      <TopBar
        title="Book Appointment"
        backTo={bookingStep > 1 ? "" : "/home"}
      />
      <main className="content">
        <span className="eyebrow">STEP {bookingStep} OF 3</span>

        {bookingStep === 1 && (
          <>
            <section>
              <h1>Where would you like to be seen?</h1>
              <p>Choose a clinic and the service you need.</p>
            </section>

            <label className="field">
              <select
                value={selectedClinic?.name || ""}
                onChange={(e) => {
                  const c = clinics.find(
                    (item: any) => item.name === e.target.value
                  );
                  if (c) {
                    setSelectedClinic(c);
                    setSelectedService(c.services?.[0] || "General outpatient");
                  }
                }}
              >
                {clinics.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="chips chips--wrap">
              {selectedClinic?.services?.map((svc: string) => (
                <button
                  key={svc}
                  className={`chip ${
                    selectedService === svc ? "chip--active" : ""
                  }`}
                  onClick={() => setSelectedService(svc)}
                  aria-pressed={selectedService === svc}
                >
                  {selectedService === svc && (
                    <HugeiconsIcon icon={Tick02Icon} size={14} />
                  )}
                  <span>{svc}</span>
                </button>
              ))}
            </div>

            <div className="mt-auto pt-6">
              <Button
                disabled={!selectedService}
                onClick={() => setBookingStep(2)}
              >
                Choose a date and time
              </Button>
            </div>
          </>
        )}

        {bookingStep === 2 && (
          <>
            <section>
              <h1>Choose a time that works for you.</h1>
              <p>Available appointment times are shown below.</p>
            </section>

            <div className="chips">
              {availableDates.map((d) => (
                <button
                  key={d}
                  className={`chip ${date === d ? "chip--active" : ""}`}
                  onClick={() => setDate(d)}
                  aria-pressed={date === d}
                >
                  {date === d && (
                    <HugeiconsIcon icon={Tick02Icon} size={14} />
                  )}
                  <span>{d}</span>
                </button>
              ))}
            </div>

            <div className="time-grid">
              {availableSlots.map((s) => (
                <button
                  key={s}
                  className={`time-slot ${
                    time === s ? "time-slot--selected" : ""
                  }`}
                  onClick={() => setTime(s)}
                  aria-pressed={time === s}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="mt-auto pt-6">
              <Button disabled={!time} onClick={() => setBookingStep(3)}>
                Review booking
              </Button>
            </div>
          </>
        )}

        {bookingStep === 3 && (
          <>
            <section>
              <h1>Check your visit details.</h1>
              <p>Confirm everything looks right before you reserve.</p>
            </section>

            <div className="p-4 rounded-2xl border border-neutral-200 bg-white stack text-sm">
              <div className="flex justify-between border-b border-neutral-100 pb-2">
                <span className="text-neutral-500">Facility</span>
                <strong>{selectedClinic?.name}</strong>
              </div>
              <div className="flex justify-between border-b border-neutral-100 pb-2">
                <span className="text-neutral-500">Service</span>
                <strong>{selectedService}</strong>
              </div>
              <div className="flex justify-between border-b border-neutral-100 pb-2">
                <span className="text-neutral-500">Date</span>
                <strong>
                  {date} · {time}
                </strong>
              </div>
            </div>

            <div className="mt-auto pt-6 stack">
              <div className="t-icon-swap" data-state={confirming ? "b" : "a"}>
                <span className="t-icon" data-icon="a">
                  <HugeiconsIcon icon={Calendar03Icon} size={18} />
                </span>
                <span className="t-icon" data-icon="b">
                  <HugeiconsIcon icon={RefreshIcon} size={18} />
                </span>
              </div>
              <Button
                disabled={confirming}
                onClick={handleConfirm}
              >
                {confirming ? "Reserving…" : "Confirm booking"}
              </Button>
              <Button variant="quiet" onClick={() => setBookingStep(2)}>
                Change slot
              </Button>
            </div>
          </>
        )}
      </main>
    </>
  );
}
