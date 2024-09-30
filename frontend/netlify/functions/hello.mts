import type {Config, Context} from "@netlify/functions";

export default async (req: Request, context: Context) =>  {
    const response = {
        message: "Hello, world"
    }

    return {
        headers: { "content-type": "application/json" },
        body: JSON.stringify(response)
    }
}

export const config: Config = {
    path: "/hello"
};