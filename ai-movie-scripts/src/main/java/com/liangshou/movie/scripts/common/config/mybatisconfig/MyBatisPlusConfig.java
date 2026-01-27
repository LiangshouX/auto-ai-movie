package com.liangshou.movie.scripts.common.config.mybatisconfig;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

/**
 * MyBatis Plus配置类
 */
@Configuration
@MapperScan("com.liangshou.movie.scripts.infrastructure.datasource.mapper")
public class MyBatisPlusConfig {

//    /**
//     * 分页插件
//     */
//    @Bean
//    public MybatisPlusInterceptor mybatisPlusInterceptor() {
//        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
//        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
//        return interceptor;
//    }
}