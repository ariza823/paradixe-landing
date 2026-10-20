import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import Text from "@atoms/text/Text.tsx";
import Title from "@atoms/title/Title.tsx";
import Button from "@atoms/button/Button.tsx";
import { LogoMark } from "@atoms/logo/Logo.tsx";
import { TextField } from "@atoms/inputs/Field.tsx";
import { useAuth } from "../context/AuthContext.tsx";
import { loginSchema, type LoginValues } from "../schemas/login.zod.ts";

function DemoAccess() {
  const { enterDemo } = useAuth();
  return (
    <div className="flex flex-col gap-5">
      <Text size="body_sm" variant="muted">
        Supabase no está conectado, así que el panel corre en modo demo: los cambios se guardan solo en este
        navegador.
      </Text>
      <Button onClick={enterDemo} addStyle="w-full">
        Entrar al panel demo
      </Button>
    </div>
  );
}

function PasswordAccess() {
  const { signIn, email, isAdmin, signOut } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  if (email && !isAdmin) {
    return (
      <div className="flex flex-col gap-5">
        <Text size="body_sm" variant="danger" role="alert">
          {`${email} no tiene permisos de administrador.`}
        </Text>
        <Button variant="outline_green" onClick={() => void signOut()} addStyle="w-full">
          Usar otra cuenta
        </Button>
      </div>
    );
  }

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await signIn(values.email, values.password);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "No pudimos iniciar sesión.");
    }
  });

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-5">
      <TextField
        id="login-email"
        label="Correo"
        type="email"
        autoComplete="username"
        error={errors.email?.message}
        {...register("email")}
      />
      <TextField
        id="login-password"
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />
      {serverError && (
        <Text size="body_sm" variant="danger" role="alert">
          {serverError}
        </Text>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-accent-sky px-6 text-[13px] font-bold uppercase tracking-[2px] text-on-accent enabled:hover:brightness-110 disabled:opacity-45"
      >
        {isSubmitting ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}

export function LoginPanel() {
  const { isDemo } = useAuth();

  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-16">
      <div className="flex w-full max-w-sm flex-col gap-8 border border-dashed border-line bg-surface p-6 sm:p-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <LogoMark />
          <Title as="h1" size="panel">
            Panel Paradixe
          </Title>
          <Text size="label" variant="muted">
            Solo administradores
          </Text>
        </div>
        {isDemo ? <DemoAccess /> : <PasswordAccess />}
        <Link
          to="/"
          className="self-center text-[12px] font-bold uppercase tracking-[2px] text-ink-muted underline decoration-dashed underline-offset-4 hover:text-ink"
        >
          Volver al sitio
        </Link>
      </div>
    </main>
  );
}
