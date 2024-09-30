import type {Config, Context} from "@netlify/functions";

const options = {
    headers: {
        "Content-Type": "application/json"
    }
}

export default async (req: Request, context: Context) =>  {
    const response = {
        message: "Hello, world"
    }

    return new Response(JSON.stringify(response), options);
}

export const config: Config = {
    path: "/hello"
};