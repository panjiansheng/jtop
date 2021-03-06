package cn.com.mjsoft.cms.stat.bean;

import java.util.Date;

public class StatClassContentTraceBean
{
    private Long classId;

    private Long siteId;

    private Long addCount;

    private Long pubCount;

    private Long imgCount;

    private Long videoCount;

    private Integer upYear;

    private Integer upMon;

    private Integer upDay;

    private Date upDT;

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

    public Date getUpDT()
    {
        return upDT;
    }

    public void setUpDT( Date upDT )
    {
        this.upDT = upDT;
    }

}
