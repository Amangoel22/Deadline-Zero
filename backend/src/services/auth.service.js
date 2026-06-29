import prisma from '../config/prisma.js';

class AuthService {
  async signup({ name, email, password }) {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password
      }
    });

    return user;
  }

  async login({ email, password }) {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.password !== password) {
      throw new Error('Invalid password');
    }

    return user;
  }
}

export default new AuthService();