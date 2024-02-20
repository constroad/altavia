
import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { ApiTimeTracker, onApiError, onApiNoMatch } from "src/common/utils";

const router = createRouter<NextApiRequest, NextApiResponse>();

const getProviders = (req: NextApiRequest, res: NextApiResponse) => {
    // const user = getUser(req.query.id);
    const user = {}
    res.json({ user });
}
const addProvider = (req: NextApiRequest, res: NextApiResponse) => {
    // const user = getUser(req.query.id);
    const user = {}
    res.json({ user });
}
const updateProvider = (req: NextApiRequest, res: NextApiResponse) => {
    // const user = getUser(req.query.id);
    const user = {}
    res.json({ user });
}
const deleteProvider = (req: NextApiRequest, res: NextApiResponse) => {
    // const user = getUser(req.query.id);
    const user = {}
    res.json({ user });
}

router
  .use(ApiTimeTracker)
  .get(getProviders)
  .post(addProvider)
  .put(updateProvider)
  .delete(deleteProvider);

export const config = {
  runtime: "edge",
};

export default router.handler({
  onError: onApiError('providers / index'),
  onNoMatch: onApiNoMatch
});