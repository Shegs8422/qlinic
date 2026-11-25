export const phoneSchema = {
  parse: (v: string) => {
    const digits = v.replace(/\D/g, "");
    if (digits.length < 8 || digits.length > 15) throw new Error("Invalid phone");
    return digits;
  },
};

export const otpSchema = {
  parse: (v: string) => {
    if (!/^\d{6}$/.test(v)) throw new Error("Invalid OTP");
    return v;
  },
};

export const nameSchema = {
  parse: (v: string) => {
    if (v.length < 2 || v.length > 100) throw new Error("Invalid name");
    return v;
  },
};

export const clinicIdSchema = {
  parse: (v: string | undefined) => {
    if (v !== undefined && v.length > 50) throw new Error("ID too long");
    return v;
  },
  optional: () => ({}),
};

export type PhoneInput = string;
export type OtpInput = string;
export type NameInput = string;

export type ZodSchema<T> = {
  parse: (v: unknown) => T;
};
