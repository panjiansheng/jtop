package cn.com.mjsoft.cms.stat.dao.vo;

import java.sql.Timestamp;

import cn.com.mjsoft.framework.persistence.core.annotation.Table;
import cn.com.mjsoft.framework.persistence.core.support.EntitySqlBridge;

@Table( name = "stat_class_content_trace", id = "", idMode = EntitySqlBridge.NO_KEY_ID )
public class StatClassContentTrace
{
    private Long classId = Long.valueOf( -1 );

    private Long siteId = Long.valueOf( -1 );

    private Long addCount;

    private Long pubCount;

    private Long imgCount;

    private Long videoCount;

    private Integer upYear;

    private Integer upMon;

    private Integer upDay;

    private Timestamp upDT;

    

    public Long getClassId()
    {
        return this.classId;
    }

    public void setClassId( Long classId )
    {
        this.classId = classId;
    }

    public Long getSiteId()
    {
        return this.siteId;
    }

    public void setSiteId( Long siteId )
    {
        this.siteId = siteId;
    }

    public Long getAddCount()
    {
        return this.addCount;
    }

    public void setAddCount( Long addCount )
    {
        this.addCount = addCount;
    }

    public Long getPubCount()
    {
        return this.pubCount;
    }

    public void setPubCount( Long pubCount )
    {
        this.pubCount = pubCount;
    }

    public Long getImgCount()
    {
        return this.imgCount;
    }

    public void setImgCount( Long imgCount )
    {
        this.imgCount = imgCount;
    }

    public Long getVideoCount()
    {
        return this.videoCount;
    }

    public void setVideoCount( Long videoCount )
    {
        this.videoCount = videoCount;
    }

    public Integer getUpYear()
    {
        return this.upYear;
    }

    public void setUpYear( Integer upYear )
    {
        this.upYear = upYear;
    }

    public Integer getUpMon()
    {
        return this.upMon;
    }

    public void setUpMon( Integer upMon )
    {
        this.upMon = upMon;
    }

    public Integer getUpDay()
    {
        return this.upDay;
    }

    public void setUpDay( Integer upDay )
    {
        this.upDay = upDay;
    }

    public Timestamp getUpDT()
    {
        return upDT;
    }

    public void setUpDT( Timestamp upDT )
    {
        this.upDT = upDT;
    }

}
