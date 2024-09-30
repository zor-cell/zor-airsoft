import { Config } from "@netlify/functions";
import { Types } from "ably";
import * as Ably from "ably/promises";

export default async () => {

    const optionalClientId = "optionalClientId"; 
    // When not provided in authUrl, a default will be used.
    const connection = new Ably.Realtime.Promise({ authUrl: `/.netlify/functions/ably-token-request?clientId=${optionalClientId}` });
    const channel = connection.channels.get("some-channel-name");

    await channel.subscribe((msg: Types.Message) => {
        console.log("Ably message received", msg);
        document.getElementById("response")!.innerHTML += "<br />" + JSON.stringify(msg);
    });

    channel.publish("hello-world-message", { message: "Hello world!" });
};

export const config: Config = {
    path: "/init"
};