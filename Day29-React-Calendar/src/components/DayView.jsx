import DayTimeSlots from "./DayTimeSlots";
import Events from "./Events";
import events from "../data/events.json";
export default function DayView()
{
    return (

        <div className="calendar">
           <div className="line"></div>
            <DayTimeSlots />
            <Events events={events} />
           </div>

     

    );
}