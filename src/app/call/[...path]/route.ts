import { NextRequest } from "next/server";

import { handleCallRequest } from "@/lib/server/callHandler";

type RouteContext = {
  params: {
    path: string[];
  };
};

export async function GET(request: NextRequest, context: RouteContext) {
  return handleCallRequest(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return handleCallRequest(request, context);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return handleCallRequest(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return handleCallRequest(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return handleCallRequest(request, context);
}
