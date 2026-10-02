import { redirect } from 'next/navigation'

/**
 * Root page — immediately redirects to the Arabic homepage.
 * Arabic is the default locale for Saudi Arabia.
 */
export default function RootPage() {
  redirect('/ar')
}
