<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChangePasswordRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isSpecialist();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'current_password' => [
                'required',
                'string',
            ],
            'new_password' => [
                'required',
                'string',
                'min:8',
                'max:255',
                'confirmed',
                'different:current_password',
                // Пароль должен содержать минимум одну букву и одну цифру
                'regex:/^(?=.*[a-zA-Z])(?=.*\d).+$/'
            ],
            'new_password_confirmation' => [
                'required',
                'string',
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'current_password.required' => 'Текущий пароль обязателен для заполнения',
            
            'new_password.required' => 'Новый пароль обязателен для заполнения',
            'new_password.min' => 'Новый пароль должен содержать минимум 8 символов',
            'new_password.max' => 'Новый пароль не должен превышать 255 символов',
            'new_password.confirmed' => 'Подтверждение нового пароля не совпадает',
            'new_password.different' => 'Новый пароль должен отличаться от текущего',
            'new_password.regex' => 'Новый пароль должен содержать минимум одну букву и одну цифру',
            
            'new_password_confirmation.required' => 'Подтверждение нового пароля обязательно',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'current_password' => 'текущий пароль',
            'new_password' => 'новый пароль',
            'new_password_confirmation' => 'подтверждение нового пароля',
        ];
    }

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        $errors = $validator->errors();

        throw new \Illuminate\Http\Exceptions\HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Ошибки валидации смены пароля',
                'errors' => $errors->toArray()
            ], 422)
        );
    }
}