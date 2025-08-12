<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterSpecialistRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Регистрация доступна всем неавторизованным пользователям
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            // Идентификационный номер
            'identification_number' => [
                'required',
                'string',
                'min:3',
                'max:50',
                'regex:/^[A-Za-z0-9\-_]+$/' // Только буквы, цифры, дефисы и подчеркивания
            ],
            
            // Персональные данные
            'first_name' => [
                'required',
                'string',
                'min:2',
                'max:50',
                'regex:/^[а-яёa-z\s\-]+$/ui' // Буквы, пробелы, дефисы
            ],
            'last_name' => [
                'required',
                'string',
                'min:2',
                'max:50',
                'regex:/^[а-яёa-z\s\-]+$/ui'
            ],
            
            // ДОБАВЛЕНО: Название ЦРБ
            'hospital_name' => [
                'required',
                'string',
                'min:5',
                'max:255',
                'regex:/^[а-яёa-z0-9\s\-№"«»().\/]+$/ui' // Буквы, цифры, пробелы, основные символы
            ],
            
            // Данные для входа
            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users,email'
            ],
            'password' => [
                'required',
                'string',
                'min:8',
                'max:255',
                'confirmed',
                // Пароль должен содержать минимум одну букву и одну цифру
                'regex:/^(?=.*[a-zA-Z])(?=.*\d).+$/'
            ],
            'password_confirmation' => [
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
            // Идентификационный номер
            'identification_number.required' => 'Идентификационный номер обязателен',
            'identification_number.min' => 'ID номер должен содержать минимум 3 символа',
            'identification_number.max' => 'ID номер не должен превышать 50 символов',
            'identification_number.regex' => 'ID номер может содержать только буквы, цифры, дефисы и подчеркивания',

            // Имя
            'first_name.required' => 'Имя обязательно для заполнения',
            'first_name.min' => 'Имя должно содержать минимум 2 символа',
            'first_name.max' => 'Имя не должно превышать 50 символов',
            'first_name.regex' => 'Имя может содержать только буквы, пробелы и дефисы',

            // Фамилия
            'last_name.required' => 'Фамилия обязательна для заполнения',
            'last_name.min' => 'Фамилия должна содержать минимум 2 символа',
            'last_name.max' => 'Фамилия не должна превышать 50 символов',
            'last_name.regex' => 'Фамилия может содержать только буквы, пробелы и дефисы',

            // ДОБАВЛЕНО: Название ЦРБ
            'hospital_name.required' => 'Название ЦРБ обязательно для заполнения',
            'hospital_name.min' => 'Название ЦРБ должно содержать минимум 5 символов',
            'hospital_name.max' => 'Название ЦРБ не должно превышать 255 символов',
            'hospital_name.regex' => 'Название ЦРБ содержит недопустимые символы',

            // Email
            'email.required' => 'Email обязателен для заполнения',
            'email.email' => 'Некорректный формат email',
            'email.max' => 'Email не должен превышать 255 символов',
            'email.unique' => 'Этот email уже используется',

            // Пароль
            'password.required' => 'Пароль обязателен для заполнения',
            'password.min' => 'Пароль должен содержать минимум 8 символов',
            'password.max' => 'Пароль не должен превышать 255 символов',
            'password.confirmed' => 'Подтверждение пароля не совпадает',
            'password.regex' => 'Пароль должен содержать минимум одну букву и одну цифру',

            'password_confirmation.required' => 'Подтверждение пароля обязательно',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'identification_number' => 'идентификационный номер',
            'first_name' => 'имя',
            'last_name' => 'фамилия',
            'hospital_name' => 'название ЦРБ',
            'email' => 'email',
            'password' => 'пароль',
            'password_confirmation' => 'подтверждение пароля',
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
                'message' => 'Ошибки валидации при регистрации',
                'errors' => $errors->toArray()
            ], 422)
        );
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation()
    {
        $this->merge([
            // Очищаем лишние пробелы
            'first_name' => trim($this->first_name ?? ''),
            'last_name' => trim($this->last_name ?? ''),
            'hospital_name' => trim($this->hospital_name ?? ''),
            'email' => strtolower(trim($this->email ?? '')),
            'identification_number' => trim($this->identification_number ?? ''),
        ]);
    }
}