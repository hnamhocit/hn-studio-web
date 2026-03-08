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
import { loginSchema, LoginSchema } from '@/schemas'
import { authService } from '@/services'

const LoginForm = () => {
	const {
		handleSubmit,
		control,
		formState: { errors, isSubmitting },
	} = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: '', password: '' },
	})

	const onSubmit = async (values: LoginSchema) => {
		try {
			const { error } = await authService.login(values)
			if (error) {
				toast.error('Login failed: ' + error.message, {
					position: 'top-center',
				})
			}

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			toast.error('An unexpected error occurred during login.', {
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
					Login
				</Button>
			</FieldGroup>
		</form>
	)
}

export default LoginForm
