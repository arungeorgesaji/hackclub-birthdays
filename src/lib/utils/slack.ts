export function normalizeChannelId(value: string) {
  return value
    .trim()
    .replace(/^https:\/\/hackclub\.enterprise\.slack\.com\/archives\//, '')
    .replace(/\//g, '');
}

export function getSlackChannelUrl(channelId?: string | null) {
  return channelId
    ? `https://hackclub.enterprise.slack.com/archives/${normalizeChannelId(channelId)}`
    : null;
}
