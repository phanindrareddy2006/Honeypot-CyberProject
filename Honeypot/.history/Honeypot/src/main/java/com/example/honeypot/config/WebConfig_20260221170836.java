package com.example.honeypot.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

import com.example.honeypot.interceptor.AttackInterceptor;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private AttackInterceptor interceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(interceptor)
                .addPathPatterns("/**");
    }
}