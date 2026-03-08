import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { registerSchema, RegisterSchema } from '@/schemas'
import { authService } from '@/services/auth.service'

const RegisterForm = () => {
	const {
		handleSubmit,
		control,
		formState: { errors, isSubmitting },
	} = useForm<RegisterSchema>({
		resolver: zodResolver(registerSchema),
		defaultValues: { name: '', email: '', password: '' },
	})

	const onSubmit = async (values: RegisterSchema) => {
		try {
			const { error } = await authService.register(values)
			if (error) {
				toast.error('Register failed: ' + error.message, {
					position: 'top-center',
				})
			}

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			toast.error('An unexpected error occurred during registration.', {
				position: 'top-center',
			})
		}
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='space-y-4'>
			<FieldGroup>
				<Field>
					<FieldLabel>Name</FieldLabel>

					<Controller
						control={control}
						name='name'
						render={({ field }) => (
							<Input
								placeholder='John Doe'
								{...field}
							/>
						)}
					/>

					{errors.name && (
						<FieldError>{errors.name.message}</FieldError>
					)}
				</Field>

				<Field>
					<FieldLabel>Email</FieldLabel>

					<Controller
						control={control}
						name='email'
						render={({ field }) => (
							<Input
								placeholder='name@example.com'
								{...field}
							/>
						)}
					/>

					{errors.email && (
						<FieldError>{errors.email.message}</FieldError>
					)}
				</Field>

				<Field>
					<FieldLabel>Password</FieldLabel>

					<Controller
						control={control}
						name='password'
						render={({ field }) => (
							<Input
								type='password'
								placeholder='••••••••'
								{...field}
							/>
						)}
					/>

					{errors.password && (
						<FieldError>{errors.password.message}</FieldError>
					)}
				</Field>

				<Button
					disabled={isSubmitting}
					type='submit'
					className='w-full mt-2'>
					Register
				</Button>
			</FieldGroup>
		</form>
	)
}

export default RegisterForm
