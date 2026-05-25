import * as z from 'zod'

export const createOrderSchema = z.object({
  provider: z.string().min(1, 'El proveedor es obligatorio'),
  amount: z.number({ invalid_type_error: 'El monto debe ser un número' })
    .positive('El monto debe ser mayor a 0'),
  currency: z.string().min(1, 'Seleccioná una moneda'),
  concept: z.string()
    .min(3, 'El concepto debe tener al menos 3 caracteres')
    .max(250, 'El concepto no puede superar los 250 caracteres'),
})
