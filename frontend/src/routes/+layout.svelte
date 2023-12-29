<script lang="ts">
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, setPersistence, browserSessionPersistence } from 'firebase/auth'
import { app } from '$lib/firebase'
import { onMount } from 'svelte'
import '../app.css'

const auth = getAuth(app)
const provider = new GoogleAuthProvider()
provider.addScope('https://www.googleapis.com/auth/contacts.readonly')

let isUserloggedin = false

onMount(() => {
	setPersistence(auth, browserSessionPersistence)

	onAuthStateChanged(auth, (user) => {
		if (user) isUserloggedin = true
		else {
			isUserloggedin = false
			signInWithPopup(auth, provider)
		}
	})
})
</script>

{#if isUserloggedin}
	<slot />
{:else}
	Logging in ...
{/if}
