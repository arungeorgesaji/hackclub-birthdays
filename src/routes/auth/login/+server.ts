import { redirect } from '@sveltejs/kit';
import { getHcaAuthorizeUrl } from '$lib/server/hca';

export function GET() {
  throw redirect(303, getHcaAuthorizeUrl());
}
