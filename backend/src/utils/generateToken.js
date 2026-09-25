import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'dev_secret_key_careerpilot_2026',
    { expiresIn: '30d' }
  );
};

export default generateToken;
