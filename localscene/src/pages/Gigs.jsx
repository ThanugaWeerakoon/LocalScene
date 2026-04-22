import { useEffect, useState } from "react";
import Header from "../components/Header";



export default function Gigs () {
    
useEffect(() => {
  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*, artists(*), venues(*)")
      .order("date_time", { ascending: true });

    if (!error && data) {
      const normalized = data.map((event) => ({
        id: event.id,
        event_name: event.event_name,
        date_time: event.date_time,
        available_tickets: event.available_tickets,
        ticket_price: event.ticket_price,
        booking_email: event.booking_email,
        region: event.region,
        more_info: event.more_info,
        // From artists table
        artist_name: event.artists.artist_name,
        artist_image: event.artists.image,
        artist_genre: event.artists.genre,
        // From venues table
        venue_name: event.venues.venue_name,
        venue_location: event.venues.location,
        venue_capacity: event.venues.capacity,
      }));
      setEvents(normalized);
    }
    setLoading(false);
  };
  fetchEvents();
}, []);

    return (
         <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ position: "relative", zIndex: 20 }}>
                <Header />
            </div>
            </div>

    );

}

