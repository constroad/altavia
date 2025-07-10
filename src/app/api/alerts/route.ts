import { getQueryParameters, withApi, withBodyValidation } from "@/common/utils/middleware";

import { json } from "@/common/utils/response";
import { alertSchemaValidation } from "@/models/alert";
import { alertRepository } from "@/repositories/alertRepository";
import { NextRequest } from "next/server";


export async function POST(request: NextRequest) {
  return withApi(async () => 
    withBodyValidation(alertSchemaValidation, request, async (data) => {
      const alertData = {
        ...data,
        dueDate: new Date(data.dueDate),
      };
      const created = await alertRepository.create(alertData);
      return json(created, 201);
    })
  )
}


export async function GET(request: NextRequest) {
  return withApi(async () => {
    const filter: any = {};
    const { name, type } = getQueryParameters(request)

    if (name) {
      filter.name = name
    }
    if (type) {
      filter.type = type
    }

    const alerts = await alertRepository.findAll(filter);
    return json(alerts);
  })

}