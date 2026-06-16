echo "--- CHECK 1 ---"
grep -rn "SecurityFilterChain" /root/neura-fullstack/backend/src/main/java/
echo "--- CHECK 2 ---"
grep -rn -e "@PreAuthorize" -e "@PostAuthorize" -e "@Secured" -e "@RolesAllowed" /root/neura-fullstack/backend/src/main/java/ || true
grep -rn -e "@EnableMethodSecurity" -e "@EnableGlobalMethodSecurity" /root/neura-fullstack/backend/src/main/java/ || true
echo "--- CHECK 3 ---"
grep -rln -e "OncePerRequestFilter" -e "implements Filter" /root/neura-fullstack/backend/src/main/java/ || true
echo "--- CHECK 4 ---"
cat /root/neura-fullstack/backend/src/main/java/app/neura/controller/AuthController.java
echo "--- CHECK 5 ---"
cd /root/neura-fullstack
docker compose images
docker compose ps
ls -la backend/src/main/java/app/neura/config/SecurityConfig.java
