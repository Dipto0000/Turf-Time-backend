import User from '../models/User';

const SUPER_ADMIN_EMAIL = 'dipto2041@gmail.com';
const SUPER_ADMIN_PASSWORD = 'Msad2041';
const SUPER_ADMIN_NAME = 'Super Admin';
const SUPER_ADMIN_PHONE = '01700000000';

export const seedSuperAdmin = async () => {
  const existingSuperAdmin = await User.findOne({ email: SUPER_ADMIN_EMAIL });

  if (existingSuperAdmin) {
    console.log('Super admin already exists.');
    return;
  }

  await User.create({
    name: SUPER_ADMIN_NAME,
    email: SUPER_ADMIN_EMAIL,
    password: SUPER_ADMIN_PASSWORD,
    role: 'admin',
    isSuperAdmin: true,
    isActive: true,
    phone: SUPER_ADMIN_PHONE,
  });

  console.log('Super admin created successfully.');
  console.log(`Email: ${SUPER_ADMIN_EMAIL}`);
  console.log(`Password: ${SUPER_ADMIN_PASSWORD}`);
};
