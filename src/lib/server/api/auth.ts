import { Elysia, t } from 'elysia';
import { db } from '../db';
import { user } from '../db/schema';
import { eq, or } from 'drizzle-orm';
import { generateSessionToken, createSession } from '../auth';
import { verify, hash } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';

const signinBody = t.Object({
	username: t.String(),
	password: t.String()
});

const registerBody = t.Object({
	username: t.String(),
	password: t.String(),
	email: t.String()
});

const AuthModel = new Elysia().model({
	'auth.sign': signinBody,
	'auth.register': registerBody
});

export const auth = new Elysia({ prefix: '/auth' })
	.use(AuthModel)
	.post(
		'/login',
		async ({ body, error }) => {
			if (!body.username || !body.password) {
				return error(400, { message: 'Missing username or password' });
			}

			const results = await db
				.select()
				.from(user)
				.where(or(eq(user.username, body.username), eq(user.email, body.username)));
			const existingUser = results.at(0);
			if (!existingUser) {
				return error(400, { message: 'Incorrect username or password' });
			}

			const validPassword = await verify(existingUser.passwordHash, body.password, {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			});

			if (!validPassword) {
				return error(400, { message: 'Incorrect username or password' });
			}

			return { message: 'Logged in', userId: existingUser.id };
		},
		{ body: 'auth.sign' }
	)
	.post(
		'/register',
		async ({ body, error, cookie: { session } }) => {
			if (!body.username || !body.password || !body.email) {
				return error(400, { message: 'Missing username or password' });
			}

			const userId = generateUserId();
			console.debug('userId', userId);
			const passwordHash = await hash(body.password, {
				// recommended minimum parameters
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			});

			try {
				console.debug('registering user', body);
				await db
					.insert(user)
					.values({ id: userId, username: body.username, passwordHash, email: body.email });
				const sessionToken = generateSessionToken();
				const newSession = await createSession(sessionToken, userId);
				session.set({
					domain: 'auth-session',
					value: sessionToken,
					expires: newSession.expiresAt,
					path: '/'
				});
			} catch (err) {
				console.debug(err);
				return error(500, { message: 'An error has occurred' });
			}
			return { message: 'Registered' };
		},
		{ body: 'auth.register' }
	);

function generateUserId() {
	// ID with 120 bits of entropy, or about the same as UUID v4.
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const id = encodeBase32LowerCase(bytes);
	return id;
}
