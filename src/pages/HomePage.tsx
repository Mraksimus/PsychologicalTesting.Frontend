import { ColorSchemeToggle } from '@/components/ColorSchemeToggle/ColorSchemeToggle';
import { Welcome } from '@/components/Welcome/Welcome';
import RegisterPage from "@/pages/RegisterPage";

export function HomePage() {
  return (
    <>
      <RegisterPage />
      <ColorSchemeToggle />
    </>
  );
}
