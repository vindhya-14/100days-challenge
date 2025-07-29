export default function DayTimeSlots() {
  const slots = Array.from({ length: 24 }, (_, index) => index);

  return (
    <>
      {slots.map((slot) => {
        return (
          <div key={slot} className="slot">
            {slot}:00
          </div>
        );
      })}
    </>
  );
}
