-- Delete the broken admin user so you can sign up with the email again
delete from auth.users where email = 'admin@moodbrew.com';
