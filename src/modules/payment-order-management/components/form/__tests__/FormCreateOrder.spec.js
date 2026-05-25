import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createOrderSchema } from '@/modules/payment-order-management/schemas/order.schema.js'

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
const mockMutateAsync = vi.fn()
beforeEach(() => {
  mockMutateAsync.mockReset()
  mockMutateAsync.mockResolvedValue({ id: 'new-001' })
})

vi.mock('@/modules/payment-order-management/api/composables/use-create-order.js', () => ({
  useCreateOrder: () => ({
    mutateAsync: mockMutateAsync,
    isPending: { value: false },
    error: { value: null },
  }),
}))

import FormCreateOrder from '@/modules/payment-order-management/components/form/FormCreateOrder.vue'

// ---------------------------------------------------------------------------
// Stub setup
// ---------------------------------------------------------------------------
const UFormStub = {
  name: 'UForm',
  props: { schema: Object, state: Object },
  emits: ['submit'],
  template: '<form @submit.prevent="onSubmit"><slot /></form>',
  methods: {
    onSubmit() {
      const result = this.schema.safeParse(this.state)
      if (result.success) {
        this.$emit('submit', { data: result.data })
      }
    },
  },
}

function createWrapper() {
  return mount(FormCreateOrder, {
    global: {
      stubs: {
        UForm: UFormStub,
        UButton: {
          name: 'UButton',
          template: '<button @click="$emit(\'click\', $event)"><slot /></button>',
        },
        FieldsOrderForm: {
          name: 'FieldsOrderForm',
          props: { modelValue: Object },
          emits: ['update:modelValue'],
          template: '<div class="fields-stub" />',
        },
      },
    },
  })
}

// ---------------------------------------------------------------------------
// Schema validation (unit-test the schema directly)
// ---------------------------------------------------------------------------
describe('FormCreateOrder — validation rules', () => {
  it('rejects empty form', () => {
    const result = createOrderSchema.safeParse({ provider: '', amount: null, currency: 'COP', concept: '' })
    expect(result.success).toBe(false)
  })

  it('rejects empty provider', () => {
    expect(createOrderSchema.safeParse({ provider: '', amount: 1500, currency: 'COP', concept: 'valid' }).success).toBe(false)
  })

  it('rejects zero amount', () => {
    expect(createOrderSchema.safeParse({ provider: 'ACME', amount: 0, currency: 'COP', concept: 'valid' }).success).toBe(false)
  })

  it('rejects negative amount', () => {
    expect(createOrderSchema.safeParse({ provider: 'ACME', amount: -1, currency: 'COP', concept: 'valid' }).success).toBe(false)
  })

  it('rejects string amount', () => {
    const result = createOrderSchema.safeParse({ provider: 'ACME', amount: 'abc', currency: 'COP', concept: 'valid' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.amount).toBeDefined()
    }
  })

  it('rejects empty currency', () => {
    expect(createOrderSchema.safeParse({ provider: 'ACME', amount: 100, currency: '', concept: 'valid' }).success).toBe(false)
  })

  it('rejects short concept (< 3 chars)', () => {
    expect(createOrderSchema.safeParse({ provider: 'ACME', amount: 100, currency: 'COP', concept: 'ab' }).success).toBe(false)
  })

  it('accepts valid payload', () => {
    expect(createOrderSchema.safeParse({ provider: 'ACME Corp', amount: 2500.5, currency: 'USD', concept: 'Monthly service' }).success).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Component integration tests
// ---------------------------------------------------------------------------
describe('FormCreateOrder — integration', () => {
  it('renders submit and cancel buttons', () => {
    const wrapper = createWrapper()
    expect(wrapper.findAllComponents({ name: 'UButton' }).length).toBe(2)
  })

  it('emits cancel when cancel button is clicked', async () => {
    const wrapper = createWrapper()
    const cancelBtn = wrapper.findAllComponents({ name: 'UButton' })[0]
    cancelBtn.vm.$emit('click', new MouseEvent('click'))
    expect(wrapper.emitted('on-cancel')).toBeTruthy()
  })

  it('rejects empty submission through the component', () => {
    const wrapper = createWrapper()
    wrapper.findComponent({ name: 'UForm' }).vm.onSubmit()
    expect(mockMutateAsync).not.toHaveBeenCalled()
  })

  it('calls mutateAsync and emits created on valid submission', async () => {
    const wrapper = createWrapper()

    const payload = {
      provider: 'ACME Corp',
      amount: 2500.50,
      currency: 'USD',
      concept: 'Monthly service fee',
    }

    const handleSubmit = wrapper.vm.$.setupState.handleSubmit
    await handleSubmit({ data: payload })

    expect(mockMutateAsync).toHaveBeenCalledTimes(1)
    expect(mockMutateAsync).toHaveBeenCalledWith(payload)
    expect(wrapper.emitted('on-created')).toBeTruthy()
    expect(wrapper.emitted('on-created')[0][0]).toEqual(payload)
  })

  it('does not emit created when mutateAsync throws', async () => {
    mockMutateAsync.mockRejectedValueOnce(new Error('API error'))

    const wrapper = createWrapper()
    const payload = { provider: 'ACME', amount: 1000, currency: 'COP', concept: 'valid concept' }
    const handleSubmit = wrapper.vm.$.setupState.handleSubmit
    await handleSubmit({ data: payload })

    expect(wrapper.emitted('on-created')).toBeFalsy()
  })
})
