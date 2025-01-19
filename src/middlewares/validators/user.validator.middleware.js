import Joi from 'joi';

// 회원가입 검증
const signUpValidator = async (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string()
      .pattern(/^[a-zA-Z가-힣\s]*$/)
      .required()
      .messages({
        'any.required': '유저 이름은 필수 항목입니다.',
        'string.empty': '유저 이름은 필수 항목입니다.',
        'string.pattern.base': '유저 이름은 영문자(대소문자), 한글만 포함되어야 합니다.',
      }),
    password: Joi.string().min(6).required().messages({
      'any.required': '비밀번호는 필수 항목입니다.',
      'string.min': '비밀번호는 최소 6자리 이상이어야 합니다.',
    }),
    nickname: Joi.string()
      .pattern(/^[a-zA-Z0-9가-힣]*$/)
      .min(3)
      .max(20)
      .messages({
        'string.pattern.base': '닉네임은 영문자(대소문자), 숫자, 그리고 한글만 포함되어야 합니다.',
      }),
  });

  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    const key = error.details[0].context.key;
    const type = error.details[0].type;
    if (error) {
      if (key === 'username') {
        if (type === 'any.required' || type === 'string.empty') {
          return res.status(400).json({ message: '유저 이름은 필수 항목입니다.' });
        } else if (type === 'string.pattern') {
          return res
            .status(400)
            .json({ message: '유저 이름은 영문자(대소문자), 한글만 포함되어야 합니다.' });
        }
      } else if (key === 'password') {
        if (type === 'any.required') {
          return res.status(400).json({ message: '비밀번호는 필수 항목입니다.' });
        } else if (type === 'string.min') {
          return res.status(400).json({ message: '비밀번호는 최소 6자리 이상이어야 합니다.' });
        }
      } else if (key === 'nickname') {
        if (type === 'string.pattern.base') {
          return res
            .status(400)
            .json({ message: '닉네임은 영문자(대소문자), 숫자, 그리고 한글만 포함되어야 합니다.' });
        }
      }
      return res.status(400).json({ message: error.details[0].message });
    }
  }
};

export { signUpValidator };
