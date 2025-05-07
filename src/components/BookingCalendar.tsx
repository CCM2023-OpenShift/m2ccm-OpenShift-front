import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { Booking } from '../services/Booking';

export const BookingCalendar = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const data = await Booking.getAll();
                setBookings(data);
            } catch (error) {
                console.error("Erreur lors du chargement des réservations :", error);
            } finally {
                setLoading(false);
            }
        };

        void fetchBookings();
    }, []);

    const events = bookings.map((booking) => ({
        title: booking.title,
        start: booking.startTime,
        end: booking.endTime,
        extendedProps: {
            room: booking.room?.name,
        },
    }));

    if (loading) {
        return <div className="p-6">Chargement du calendrier...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Calendrier des réservations</h2>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                locale={frLocale}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                events={events}
                height="auto"
                eventContent={(arg) => (
                    <div>
                        <strong>{arg.event.title}</strong><br />
                        <span className="text-xs">{arg.event.extendedProps.room}</span>
                    </div>
                )}
            />
        </div>
    );
};
