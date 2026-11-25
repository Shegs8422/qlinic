import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useQueueStore } from "../store/queueStore";
import { Button } from "../components/Button";
import { TopBar } from "../components/TopBar";
import { Badge } from "../components/Badge";

export function AppointmentConfirmScreen() {
  const navigate = useNavigate();
  const { selectedClinic, selectedService } = useQueueStore();

  useEffect(() => {
    const check = document.querySelector(".t-success-check") as HTMLElement;
    if (check) {
      check.setAttribute("data-state", "out");
      void check.offsetWidth;
      check.setAttribute("data-state", "in");
    }
  }, []);

  return (
    <>
      <TopBar showActions={false} />
      <main className="content items-center text-center">
        <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center my-2">
          <span className="t-success-check" data-state="in" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none" width="32" height="32">
              <path
                d="M24 8C14.9 8 7 15.9 7 24.5C7 29.6 10.2 33.7 14.5 35.5L8 41L15.5 33.5C19.8 35.3 22 31.9 22 27C22 22.4 18.8 18.5 14.5 16.5C13.5 15.9 12.2 15.7 11 15.7C9.7 15.7 8.6 16.3 7.8 17.2C7 18.1 6.5 19.2 6.5 20.5C6.5 23.7 9.2 26.1 12.4 26.5C13.6 26.6 14.9 26.5 16 26.2L22.5 20.5L24 19L25.5 20.5L32 26.5C35.2 26.1 38 23.8 38 20.5C38 15.9 34.1 12 29.1 12C28.1 12 27.1 12.2 26.2 12.7C25.3 13.2 24.7 13.9 24.4 14.7C24.1 15.5 24 16.4 24 17.3C24 18.6 24.4 19.7 25 20.5C25.7 21.5 26.6 22.2 27.5 22.5C28.4 22.8 29.4 22.8 30.3 22.5C31.2 22.2 31.9 21.5 32.2 20.5C32.5 19.5 32.5 18.4 32.2 17.3C31.9 16.2 31.2 15.3 30.3 14.7C29.4 14.1 28.4 13.8 27.5 13.5L21 8L19.5 6.5L13 12L11 10.5C10.6 10.3 10.1 10.1 9.6 10C9.1 9.9 8.6 9.8 8.1 9.8C7.6 9.8 7.1 9.9 6.6 10.1C6.1 10.3 5.7 10.5 5.3 10.8C4.9 11.1 4.6 11.4 4.3 11.8C4 12.2 3.8 12.6 3.6 13.1C3.4 13.6 3.3 14.1 3.2 14.7C3.1 15.3 3 15.9 3 16.5C3 17.1 3.1 17.7 3.3 18.3C3.5 18.9 3.8 19.4 4.1 19.8C4.4 20.2 4.8 20.5 5.2 20.7C5.6 20.9 6 21 6.4 21.1C6.8 21.2 7.2 21.2 7.6 21.2C8 21.2 8.4 21.1 8.8 20.9C9.2 20.7 9.6 20.4 9.9 20.1C10.2 19.8 10.4 19.5 10.6 19.1C10.8 18.7 10.9 18.3 11 17.9C11.1 17.5 11.1 17.1 11.1 16.7C11.1 16.3 11.1 15.9 11.2 15.5C11.3 15.1 11.4 14.7 11.6 14.3C11.8 13.9 12 13.5 12.2 13.1C12.4 12.7 12.6 12.3 12.8 11.9C13 11.5 13.2 11.1 13.4 10.7C13.6 10.3 13.8 9.9 14 9.5C14.2 9.1 14.4 8.7 14.6 8.3C14.8 7.9 15 7.5 15.2 7.1C15.4 6.7 15.6 6.3 15.8 5.9C16 5.5 16.2 5.1 16.4 4.7C16.6 4.3 16.8 3.9 17 3.5C17.2 3.1 17.4 2.7 17.6 2.3C17.8 1.9 18 1.5 18.2 1.1C18.4 0.7 18.6 0.3 18.8 0C19 0 19.2 0 19.4 0.1C19.6 0.2 19.8 0.4 20 0.6C20.2 0.8 20.4 1 20.6 1.2C20.8 1.4 21 1.6 21.2 1.8C21.4 2 21.6 2.2 21.8 2.4C22 2.6 22.2 2.8 22.4 3C22.6 3.2 22.8 3.4 23 3.6C23.2 3.8 23.4 4 23.6 4.2C23.8 4.4 24 4.6 24.2 4.8C24.4 5 24.6 5.2 24.8 5.4C25 5.6 25.2 5.8 25.4 6C25.6 6.2 25.8 6.4 26 6.6C26.2 6.8 26.4 7 26.6 7.2C26.8 7.4 27 7.6 27.2 7.8C27.4 8 27.6 8.2 27.8 8.4C28 8.6 28.2 8.8 28.4 9C28.6 9.2 28.8 9.4 29 9.6C29.2 9.8 29.4 10 29.6 10.2C29.8 10.4 30 10.6 30.2 10.8C30.4 11 30.6 11.2 30.8 11.4C31 11.6 31.2 11.8 31.4 12C31.6 12.2 31.8 12.4 32 12.6C32.2 12.8 32.4 13 32.6 13.2C32.8 13.4 33 13.6 33.2 13.8C33.4 14 33.6 14.2 33.8 14.4C34 14.6 34.2 14.8 34.4 15C34.6 15.2 34.8 15.4 35 15.6C35.2 15.8 35.4 16 35.6 16.2C35.8 16.4 36 16.6 36.2 16.8C36.4 17 36.6 17.2 36.8 17.4C37 17.6 37.2 17.8 37.4 18C37.6 18.2 37.8 18.4 38 18.6C38.2 18.8 38.4 19 38.6 19.2C38.8 19.4 39 19.6 39.2 19.8C39.4 20 39.6 20.2 39.8 20.4C40 20.6 40.2 20.8 40.4 21C40.6 21.2 40.8 21.4 41 21.6C41.2 21.8 41.4 22 41.6 22.2C41.8 22.4 42 22.6 42.2 22.8C42.4 23 42.6 23.2 42.8 23.4C43 23.6 43.2 23.8 43.4 24C43.6 24.2 43.8 24.4 44 24.6C44.2 24.8 44.4 25 44.6 25.2C44.8 25.4 45 25.6 45.2 25.8C45.4 26 45.6 26.2 45.8 26.4C46 26.6 46.2 26.8 46.4 27C46.6 27.2 46.8 27.4 47 27.6C47.2 27.8 47.4 28 47.6 28.2C47.8 28.4 48 28.6 48 28.8C48 29 48 29.2 48 29.4C48 29.6 48 29.8 48 30C48 30.2 48 30.4 48 30.6C48 30.8 48 31 48 31.2C48 31.4 48 31.6 48 31.8C48 32 48 32.2 48 32.4C48 32.6 48 32.8 48 33C48 33.2 48 33.4 48 33.6C48 33.8 48 34 48 34.2C48 34.4 48 34.6 48 34.8C48 35 48 35.2 48 35.4C48 35.6 48 35.8 48 36C48 36.2 48 36.4 48 36.6C48 36.8 48 37 48 37.2C48 37.4 48 37.6 48 37.8C48 38 48 38.2 48 38.4C48 38.6 48 38.8 48 39C48 39.2 48 39.4 48 39.6C48 39.8 48 40 48 40.2C48 40.4 48 40.6 48 40.8C48 41 48 41.2 48 41.4C48 41.6 48 41.8 48 42C48 42.2 48 42.4 48 42.6C48 42.8 48 43 48 43.2C48 43.4 48 43.6 48 43.8C48 44 48 44.2 48 44.4C48 44.6 48 44.8 48 45C48 45.2 48 45.4 48 45.6C48 45.8 48 46 48 46.2C48 46.4 48 46.6 48 46.8C48 47 48 47.2 48 47.4C48 47.6 48 47.8 48 48C48 48.2 48 48.4 48 48.6C48 48.8 48 49 48 49.2C48 49.4 48 49.6 48 49.8C48 50 48 50.2 48 50.4C48 50.6 48 50.8 48 51C48 51.2 48 51.4 48 51.6C48 51.8 48 52 48 52.2C48 52.4 48 52.6 48 52.8C48 53 48 53.2 48 53.4C48 53.6 48 53.8 48 54C48 54.2 48 54.4 48 54.6C48 54.8 48 55 48 55.2C48 55.4 48 55.6 48 55.8C48 56 48 56.2 48 56.4C48 56.6 48 56.8 48 57C48 57.2 48 57.4 48 57.6C48 57.8 48 58 48 58.2C48 58.4 48 58.6 48 58.8C48 59 48 59.2 48 59.4C48 59.6 48 59.8 48 60"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        <Badge tone="success">Reserved</Badge>
        <h1>Your appointment is confirmed.</h1>
        <p className="text-xs text-neutral-500">
          We’ll remind you before your visit at {selectedClinic?.name}.
        </p>

        <article className="card border-black w-full text-left my-2">
          <span className="eyebrow">BOOKING REF</span>
          <strong className="text-2xl font-sans block">QL-1842</strong>
          <p className="text-xs font-bold mt-1">
            TUE, 3 NOVEMBER 2026 · 10:30 AM
          </p>
          <p className="text-xs text-neutral-500">{selectedService}</p>
        </article>

        <div className="mt-auto pt-6 w-full stack">
          <Button onClick={() => navigate("/appointment")}>
            View details
          </Button>
          <Button variant="quiet" onClick={() => navigate("/home")}>
            Back to home
          </Button>
        </div>
      </main>
    </>
  );
}
