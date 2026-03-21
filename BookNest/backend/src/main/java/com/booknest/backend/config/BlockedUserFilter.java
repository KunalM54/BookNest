package com.booknest.backend.config;

import com.booknest.backend.repository.UserRepository;
import com.booknest.backend.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class BlockedUserFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public BlockedUserFilter(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/api/auth") || path.startsWith("/api/reports") || path.startsWith("/test");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {
            String email = jwtUtil.extractUsername(token);
            
            if (email == null || email.isBlank() || !jwtUtil.validateToken(token, email)) {
                sendUnauthorized(response);
                return;
            }

            String role = null;
            try {
                role = jwtUtil.extractClaim(token, claims -> (String) claims.get("role"));
            } catch (Exception ignored) {
                role = null;
            }

            if ("ADMIN".equalsIgnoreCase(role)) {
                filterChain.doFilter(request, response);
                return;
            }

            var userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                sendUnauthorized(response);
                return;
            }

            if (!userOpt.get().isActive()) {
                sendForbidden(response);
                return;
            }
        } catch (Exception ex) {
            sendUnauthorized(response);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void sendUnauthorized(HttpServletResponse response) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"success\":false,\"message\":\"Invalid or expired token\"}");
    }

    private void sendForbidden(HttpServletResponse response) throws IOException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");
        response.getWriter().write("{\"success\":false,\"message\":\"Your account is blocked\"}");
    }
}
