import React from 'react'
import { after, connection } from "next/server";
import ExploreBtn from "@/app/component/ExploreBtn";
import EventCard from "@/app/component/EventCard";
import {events} from "@/lib/constant";
import { flushPostHogLogs, logFeaturedEventsRendered } from "@/lib/posthog-logger";

const Page = async () => {
    await connection();
    logFeaturedEventsRendered(events.length);
    after(flushPostHogLogs);

    return (

        <section>
        <h1 className="text-center">The Hub for Every Dev <br/> Event You Can't Miss</h1>
            <p className="text-center mt-5 ">Hackathons, Meetups,and Conferences, All in One Place</p>

            <ExploreBtn/>

            <div className="mt-20 space-y-7">
                <h3>Featured Events</h3>

                <ul className="events">
                    {events.map((event) => (
                        <li key={event.title}>
                            <EventCard{...event} />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}
export default Page
