<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
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
        $userId = $this->user()->id;

        return [
            'first_name' => [
                'required',
                'string',
                'min:2',
                'max:50',
                'regex:/^[а-яё\s\-]+$/ui'
            ],
            'last_name' => [
                'required',
                'string',
                'min:2',
                'max:50',
                'regex:/^[а-яё\s\-]+$/ui'
            ],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($userId)
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'first_name.required' => 'Имя обязательно для заполнения',
            'first_name.min' => 'Имя должно содержать минимум 2 символа',
            'first_name.max' => 'Имя не должно превышать 50 символов',
            'first_name.regex' => 'Имя может содержать только буквы, пробелы и дефисы',
            
            'last_name.required' => 'Фамилия обязательна для заполнения',
            'last_name.min' => 'Фамилия должна содержать минимум 2 символа',
            'last_name.max' => 'Фамилия не должна превышать 50 символов',
            'last_name.regex' => 'Фамилия может содержать только буквы, пробелы и дефисы',
            
            'email.required' => 'Email обязателен для заполнения',
            'email.email' => 'Некорректный формат email',
            'email.max' => 'Email не должен превышать 255 символов',
            'email.unique' => 'Этот email уже используется другим пользователем',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'first_name' => 'имя',
            'last_name' => 'фамилия',
            'email' => 'email',
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
                'message' => 'Ошибки валидации профиля',
                'errors' => $errors->toArray()
            ], 422)
        );
    }
}