"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface FormData {
    firstName: string
    middleName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
}

interface FormErrors {
    firstName?: string
    middleName?: string
    lastName?: string
    email?: string
    password?: string
    confirmPassword?: string
}

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const [step, setStep] = useState<1 | 2>(1)
    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [errors, setErrors] = useState<FormErrors>({})

    // Validation functions
    const validateName = (name: string, fieldName: string): string | undefined => {
        if (!name.trim()) {
            return `${fieldName} is required`
        }
        if (name.trim().length < 2) {
            return `${fieldName} must be at least 2 characters`
        }
        if (!/^[a-zA-Z\s'-]+$/.test(name)) {
            return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`
        }
        return undefined
    }

    const validateEmail = (email: string): string | undefined => {
        if (!email.trim()) {
            return "Email is required"
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return "Please enter a valid email address"
        }
        return undefined
    }

    const validatePassword = (password: string): string | undefined => {
        if (!password) {
            return "Password is required"
        }
        if (password.length < 8) {
            return "Password must be at least 8 characters"
        }
        if (!/(?=.*[a-z])/.test(password)) {
            return "Password must contain at least one lowercase letter"
        }
        if (!/(?=.*[A-Z])/.test(password)) {
            return "Password must contain at least one uppercase letter"
        }
        if (!/(?=.*\d)/.test(password)) {
            return "Password must contain at least one number"
        }
        if (!/(?=.*[@$!%*?&#])/.test(password)) {
            return "Password must contain at least one special character (@$!%*?&#)"
        }
        return undefined
    }

    const validateConfirmPassword = (
        password: string,
        confirmPassword: string
    ): string | undefined => {
        if (!confirmPassword) {
            return "Please confirm your password"
        }
        if (password !== confirmPassword) {
            return "Passwords do not match"
        }
        return undefined
    }

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }))
        }
    }

    const validateStep1 = (): boolean => {
        const newErrors: FormErrors = {}

        newErrors.firstName = validateName(formData.firstName, "First name")
        // Middle name is optional but if provided, validate it
        if (formData.middleName.trim()) {
            newErrors.middleName = validateName(formData.middleName, "Middle name")
        }
        newErrors.lastName = validateName(formData.lastName, "Last name")
        newErrors.email = validateEmail(formData.email)

        setErrors(newErrors)

        // Return true if no errors
        return !Object.values(newErrors).some((error) => error !== undefined)
    }

    const validateStep2 = (): boolean => {
        const newErrors: FormErrors = {}

        newErrors.password = validatePassword(formData.password)
        newErrors.confirmPassword = validateConfirmPassword(
            formData.password,
            formData.confirmPassword
        )

        setErrors(newErrors)

        return !Object.values(newErrors).some((error) => error !== undefined)
    }

    const handleProceed = (e: React.FormEvent) => {
        e.preventDefault()
        if (validateStep1()) {
            setStep(2)
        }
    }

    const handleBack = () => {
        setStep(1)
        setErrors({})
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validateStep2()) {
            // Here you would typically call your signup API
            console.log("Form submitted:", formData)
            // Handle successful signup
        }
    }

    return (
        <form
            className={cn("flex flex-col gap-6", className)}
            onSubmit={step === 1 ? handleProceed : handleSubmit}
            {...props}
        >
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-semibold">Create your account</h1>
                    <p className="text-sm text-muted-foreground">
                        Step {step} of 2: {step === 1 ? "Personal Information" : "Security"}
                    </p>
                </div>

                {step === 1 ? (
                    <>
                        <Field>
                            <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                            <Input
                                id="firstName"
                                type="text"
                                placeholder="John"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange("firstName", e.target.value)}
                                className={errors.firstName ? "border-destructive focus-visible:ring-destructive" : ""}
                            />
                            {errors.firstName && (
                                <FieldError>{errors.firstName}</FieldError>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="middleName">
                                Middle Name <span className="text-muted-foreground">(Optional)</span>
                            </FieldLabel>
                            <Input
                                id="middleName"
                                type="text"
                                placeholder="Michael"
                                value={formData.middleName}
                                onChange={(e) => handleInputChange("middleName", e.target.value)}
                                className={errors.middleName ? "border-destructive focus-visible:ring-destructive" : ""}
                            />
                            {errors.middleName && (
                                <FieldError>{errors.middleName}</FieldError>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                            <Input
                                id="lastName"
                                type="text"
                                placeholder="Doe"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange("lastName", e.target.value)}
                                className={errors.lastName ? "border-destructive focus-visible:ring-destructive" : ""}
                            />
                            {errors.lastName && <FieldError>{errors.lastName}</FieldError>}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john.doe@example.com"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                            />
                            {errors.email && <FieldError>{errors.email}</FieldError>}
                        </Field>

                        <Field>
                            <Button type="submit" className="w-full">
                                Proceed
                            </Button>
                        </Field>
                    </>
                ) : (
                    <>
                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => handleInputChange("password", e.target.value)}
                                className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
                            />
                            {errors.password && <FieldError>{errors.password}</FieldError>}
                            <FieldDescription>
                                Must be at least 8 characters with uppercase, lowercase, number, and special character
                            </FieldDescription>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={(e) =>
                                    handleInputChange("confirmPassword", e.target.value)
                                }
                                className={errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}
                            />
                            {errors.confirmPassword && (
                                <FieldError>{errors.confirmPassword}</FieldError>
                            )}
                        </Field>

                        <Field className="gap-2">
                            <Button type="submit" className="w-full">
                                Create Account
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={handleBack}
                            >
                                Back
                            </Button>
                        </Field>
                    </>
                )}

                <Field>
                    <FieldDescription className="text-center">
                        Already have an account?{" "}
                        <Link href="/login" className="underline underline-offset-4">
                            Log in
                        </Link>
                    </FieldDescription>
                </Field>
            </FieldGroup>
        </form>
    )
}
