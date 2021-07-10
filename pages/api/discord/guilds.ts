import { decryptToken } from 'lib/backend-utils';
import withSession from 'lib/session';
import credentialsData from 'models/credentials';
import GuildModule from 'models/guilds';
import { NextApiResponse } from 'next';
import { RawUserGivenGuild, withSessionRequest } from 'typings/typings';

const API_ENDPOINT = 'https://discord.com/api/v8';
const json = (res: Response) => res.json();

export default withSession(async (req: withSessionRequest, res: NextApiResponse) => {
  const session = req.session.get('user');

  if (!session) return res.status(401).json({ data: null, success: false });

  const results = await credentialsData.findOne({ _id: session.id });
  const decryptAccessToken = decryptToken(results.AccessToken, true);

  let userGuilds: RawUserGivenGuild[] = await fetch(`${API_ENDPOINT}/users/@me/guilds`, {
    headers: {
      Authorization: `Bearer ${decryptAccessToken}`,
    },
  }).then(json);

  if (!userGuilds.filter) return res.status(401).json({ data: null, success: false });

  // @ts-expect-error
  if (userGuilds && Array.isArray(userGuilds)) userGuilds = userGuilds.filter(g => (g.permissions & 0x20) === 0x20);

  const included = [];
  const excluded = [];

  const search = userGuilds.map(({ id }) => {
    return { _id: id };
  });

  const data = await GuildModule.find({ $or: search });
  const guildIds = userGuilds.map(({ id }) => id);

  for (const this_ of data)
    if (guildIds.includes(this_._id))
      included.push({ ...Object.fromEntries(Object.entries(this_.toObject()).filter(i => i[0] !== '_access_key')), ...userGuilds.find(g => g.id === this_._id) });

  for (const id of guildIds) if (!included.map(({ _id }) => _id).includes(id)) excluded.push(userGuilds.find(g => g.id === id));

  res.json({ data: { included, excluded }, success: true });
});
