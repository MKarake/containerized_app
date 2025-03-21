#  Use the official Nginx image from docker hub
FROM nginx:latest

#  This replaces the default Nginx config with our own custom rules.
COPY nginx.conf /etc/nginx/conf.d/default.conf

#  Copy frontend files into Nginx's root directory
COPY public /usr/share/nginx/html/

#  Expose port 80 for HTTP traffic
EXPOSE 80

#  Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
