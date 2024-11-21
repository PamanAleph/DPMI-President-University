import { redirect } from 'next/navigation'

export default function page() {
  return redirect("dashboard/profile")
}
