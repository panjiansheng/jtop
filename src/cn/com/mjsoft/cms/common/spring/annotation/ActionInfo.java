package cn.com.mjsoft.cms.common.spring.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Spring MVC 扩展注解
 * 
 * @author MJSoft
 * 
 */
@Documented
@Target( ElementType.METHOD )
@Inherited
@Retention( RetentionPolicy.RUNTIME )
public @interface ActionInfo
{
    /**
     * 当traceName有值时，将记录请求操作记录
     * 
     * @return
     */
    String traceName() default "未知";

    /**
     * 是否启用token验证访问合法性，默认为false
     * 
     * @return
     */
    boolean token() default false;

    /**
     * 请求编码，默认为UTF-8
     * 
     * @return
     */
    String encoding() default "UTF-8";

}
