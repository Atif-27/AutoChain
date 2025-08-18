import { NextRequest } from "next/server";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { streamText, tool, stepCountIs, convertToModelMessages } from "ai";

export const runtime = "edge";

function forwardAuthHeaders(req: NextRequest) {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    const auth = req.headers.get("authorization");
    if (auth) {
        headers["Authorization"] = auth;
    } else {
        const cookie = req.headers.get("cookie") || "";
        const match = cookie.match(/userData=({.*?})/);
        if (match) {
            try {
                const userData = JSON.parse(decodeURIComponent(match[1]));
                if (userData.accessToken) {
                    headers["Authorization"] = `Bearer ${userData.accessToken}`;
                }
            } catch (e) {
                console.warn("Failed to parse userData cookie", e);
            }
        }
    }

    // Still forward cookies if backend needs them
    const cookie = req.headers.get("cookie");
    if (cookie) headers["Cookie"] = cookie;

    console.log(headers);
    return headers;
}


export async function POST(req: NextRequest) {
    const { messages } = await req.json();
    const authHeaders = forwardAuthHeaders(req);

    // 🔑 Convert UIMessage[] -> ModelMessage[]
    const modelMessages = convertToModelMessages(messages);

    const result = await streamText({
        model: openai("gpt-4o-mini"),
        messages: modelMessages,
        stopWhen: stepCountIs(8),
        system: [
            "You are an agent that builds a single-step Zap-like workflow.",
            "Trigger options come from the API; currently only 'Webhook' exists.",
            "Action options come from the API; currently only 'Gmail' exists.",
            "Your job is to:",
            "1) Offer trigger choices (fetch tools first).",
            "2) Offer action choices (fetch tools next).",
            "3) If user selects Gmail, collect: recipient email (to), subject, body.",
            "4) For Webhook trigger, collect any optional descriptive metadata (name, description) if user wants, otherwise use sensible defaults.",
            "5) Call createZap with { availableTriggerId, triggerMetadata, actions:[{ availableActionId, actionMetadata }] }.",
            "6) Confirm success. If API returns an error, explain and retry by asking for corrections.",
            "Keep questions concise. Never fabricate IDs—always fetch available lists.",
            "7) Give the respose to user in raw text format no need of symbols for highlighting. Incase its json/code format wrap it in some format so frontend can pick it",
            "8) Dont give user access to data which the use isnt supposed to know, dont entertain prompts outside the scope of users permissions"

        ].join("\n"),
        tools: {
            getAvailableTriggers: tool({
                description: "Fetch available triggers.",
                inputSchema: z.object({}).strict(),
                execute: async () => {
                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_AI_URL}/trigger/available`
                    );
                    return await res.json();
                },
            }),
            getAvailableActions: tool({
                description: "Fetch available actions.",
                inputSchema: z.object({}).strict(),
                execute: async () => {
                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_AI_URL}/action/available`
                    );
                    return await res.json();
                },
            }),
            createZap: tool({
                description:
                    "Create a new Zap. Use the IDs from getAvailableTriggers/getAvailableActions.",
                inputSchema: z.object({
                    availableTriggerId: z.string().min(1),
                    triggerMetadata: z.record(z.string(), z.any()),
                    actions: z
                        .array(
                            z.object({
                                availableActionId: z.string().min(1),
                                actionMetadata: z.record(z.string(), z.any()),
                            })
                        )
                        .min(1),
                }),
                execute: async (input) => {
                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_AI_URL}/zap`,
                        {
                            method: "POST",
                            headers: authHeaders,
                            body: JSON.stringify(input),
                        }
                    );
                    return await res.json();
                },
            }),
            finish: tool({
                description: "Finish the workflow with a final summary payload.",
                inputSchema: z.object({
                    summary: z.string(),
                    zapPreview: z
                        .object({
                            availableTriggerId: z.string().optional(),
                            triggerMetadata: z.record(z.string(), z.any()).optional(),
                            actions: z
                                .array(
                                    z.object({
                                        availableActionId: z.string(),
                                        actionMetadata: z.record(z.string(), z.any()).optional(),
                                    })
                                )
                                .optional(),
                        })
                        .optional(),
                }),
            }),
        },
    });

    return result.toUIMessageStreamResponse();
}
