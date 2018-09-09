package cn.com.mjsoft.cms.search.html;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.TagSupport;

import org.apache.log4j.Logger;
import org.apache.lucene.analysis.TokenStream;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.TermPositionVector;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.search.highlight.Highlighter;
import org.apache.lucene.search.highlight.QueryScorer;
import org.apache.lucene.search.highlight.SimpleFragmenter;
import org.apache.lucene.search.highlight.SimpleHTMLFormatter;
import org.apache.lucene.search.highlight.TokenSources;

import cn.com.mjsoft.cms.channel.service.ChannelService;
import cn.com.mjsoft.cms.cluster.adapter.ClusterMapAdapter;
import cn.com.mjsoft.cms.common.Constant;
import cn.com.mjsoft.framework.util.SystemSafeCharUtil;
import cn.com.mjsoft.cms.common.page.Page;
import cn.com.mjsoft.cms.metadata.service.MetaDataService;
import cn.com.mjsoft.cms.search.service.SearchService;
import cn.com.mjsoft.cms.site.bean.SiteGroupBean;
import cn.com.mjsoft.cms.site.service.SiteGroupService;
import cn.com.mjsoft.framework.util.MathUtil;
import cn.com.mjsoft.framework.util.StringUtil;

public class ClientSearchContentListTag extends TagSupport
{
    private static final long serialVersionUID = -6583586876444827370L;

    private static Logger log = Logger.getLogger( ClientSearchContentListTag.class );

    public static ClusterMapAdapter searchKeyMap = new ClusterMapAdapter(
        "clientSearchContentListTag.searchKeyMap", Long.class, Map.class );

    public static DecimalFormat df2 = new DecimalFormat( "##0.000" );

    private static SearchService searchService = SearchService.getInstance();

    private static ChannelService channelService = ChannelService.getInstance();

    private String key = "";

    private String page = "1";

    private String pageSize = "10";

    private String enc = "";

    private String field = "";

    private String modelId = "";

    private String classId = "";

    private String dateStart = "";

    private String dateEnd = "";

    private String dateOrder = "";

    private String light = "false";

    private String lsTag = "";

    private String leTag = "";

    private String showField = "";

    private String contentLength = "90";

    @SuppressWarnings( { "rawtypes", "unchecked" } )
    public int doStartTag() throws JspException
    {
        SiteGroupBean siteBean = ( SiteGroupBean ) pageContext.getRequest().getAttribute(
            Constant.CONTENT.HTML_PUB_CURRENT_SITE );

        if( siteBean == null )
        {
            siteBean = ( SiteGroupBean ) this.pageContext.getRequest().getAttribute( "SiteObj" );

            if( siteBean == null )
            {
                siteBean = SiteGroupService
                    .getCurrentSiteInfoFromWebRequest( ( HttpServletRequest ) this.pageContext
                        .getRequest() );
            }
        }

        String keyVar = key;
        String pageVar = page;

        String[] searchFieldArray = null;

        if( StringUtil.isStringNull( field ) )
        {
            field = "title,keywords";
        }

        if( StringUtil.isStringNotNull( field ) )
        {
            searchFieldArray = ( String[] ) StringUtil.changeStringToList( field, "," ).toArray(
                new String[] {} );
        }

        String[] modelIdArray = null;

        modelIdArray = ( String[] ) StringUtil.changeStringToList( modelId, "," ).toArray(
            new String[] {} );

        String[] classIdArray = null;

        classIdArray = ( String[] ) StringUtil.changeStringToList( classId, "," ).toArray(
            new String[] {} );

        int limitVar = StringUtil.getIntValue( pageSize, 10 );

        int page = StringUtil.getIntValue( pageVar, 1 );

        if( page < 1 )
        {
            page = 1;
        }

        String queryKey = "";

        Page pageInfo = null;

        if( siteBean == null || Constant.COMMON.OFF.equals( siteBean.getSearchFun() ) )
        {
            this.pageContext.setAttribute( "searchResultList", Collections.EMPTY_LIST );
        }
        else
        {
            Long[] notUseSearchClassIdArray = channelService
                .retrieveSiteNotUseSearchFunClassId( siteBean.getSiteFlag() );

            long searchTime = 0;
            double ms = 0;

            Map searchInfo = new HashMap();

            if( enc.equals( "" ) )
            {
                enc = siteBean.getTemplateCharset();
            }

            if( StringUtil.isStringNull( keyVar ) )
            {
                keyVar = "";
            }

            queryKey = SystemSafeCharUtil.decodeFromWeb( keyVar );

            String rootFullIndexPath = SearchService.getIndexRootFullPathAndCheckDir( siteBean );

            String indexKey = SearchService.buildKey( rootFullIndexPath, siteBean.getSiteId() );

            IndexSearcher searcher = searchService.getIndexSearcher( indexKey, rootFullIndexPath );

            if( searcher != null )
            {
                log.info( "[SearchContentListTag] 查询对象:" + searcher.hashCode() );

                int currentPagEndPos = page * limitVar - 1;

                int pageStartDocId = currentPagEndPos - limitVar;

                long l1 = System.nanoTime();

                Object[] searchResult = null;

                boolean sortMode = false;

                if( StringUtil.isStringNotNull( dateOrder ) )
                {
                    sortMode = true;

                    int fullSearchLimit = currentPagEndPos + 1;

                    searchResult = SearchService.search( searcher, queryKey, searchFieldArray,
                        classIdArray, notUseSearchClassIdArray, null, modelIdArray, new String[] {
                            dateStart, dateEnd, dateOrder }, Integer.valueOf( -1 ),
                        fullSearchLimit, false );

                }
                else
                {
                    searchResult = SearchService.search( searcher, queryKey, searchFieldArray,
                        classIdArray, notUseSearchClassIdArray, null, modelIdArray, new String[] {
                            dateStart, dateEnd, dateOrder }, Integer.valueOf( pageStartDocId ),
                        limitVar, false );
                }

                List searchDisplyInfoList = new ArrayList();

                if( searchResult != null )
                {
                    pageInfo = new Page( limitVar, ( ( Integer ) searchResult[3] ).intValue(), page );

                    searchInfo.put( "pageCount", Integer.valueOf( pageInfo.getPageCount() ) );

                    searchInfo.put( "resultCount", searchResult[3] );

                    TopDocs allHotDoc = ( TopDocs ) searchResult[0];

                    try
                    {
                        ScoreDoc sdoc = null;
                        if( allHotDoc != null )
                        {
                            ScoreDoc[] scoreDocArray = allHotDoc.scoreDocs;

                            int start = 0;

                            int end = scoreDocArray.length;

                            if( sortMode )
                            {
                                start = pageStartDocId + 1;

                                end = currentPagEndPos + 1;
                            }

                            for ( int j = start; j < end; j++ )
                            {
                                Document hitDoc;

                                sdoc = scoreDocArray[j];

                                hitDoc = searcher.doc( sdoc.doc );

                                String contentId = hitDoc.get( "contentId" );
                                String title = hitDoc.get( "title" );
                                String addDate = StringUtil.replaceString( hitDoc.get( "addDate" ),
                                    ".0", "", false, false );

                                String showContent = hitDoc.get( showField );

                                String highLightTitle = title;
                                String highLightContent = showContent;

                                if( "true".equals( light ) )
                                {
                                    String startTag = StringUtil.replaceString( StringUtil
                                        .replaceString( lsTag, "[", "<", false, false ), "]", ">",
                                        false, false );

                                    String endTag = StringUtil.replaceString( StringUtil
                                        .replaceString( leTag, "[", "<", false, false ), "]", ">",
                                        false, false );

                                    SimpleHTMLFormatter simpleHTMLFormatter = new SimpleHTMLFormatter(
                                        startTag, endTag );

                                    Highlighter highlighter = new Highlighter( simpleHTMLFormatter,
                                        new QueryScorer( ( Query ) searchResult[1] ) );
                                    highlighter.setTextFragmenter( new SimpleFragmenter( StringUtil
                                        .getIntValue( contentLength, 90 ) ) );

                                    if( title != null )
                                    {
                                        TermPositionVector titletpv = ( TermPositionVector ) searcher
                                            .getIndexReader().getTermFreqVector( sdoc.doc, "title" );

                                        if( titletpv != null )
                                        {
                                            TokenStream titleTokenStream = TokenSources
                                                .getTokenStream( titletpv );

                                            highLightTitle = highlighter.getBestFragment(
                                                titleTokenStream, title );
                                        }
                                    }

                                    if( showContent != null )
                                    {

                                        TermPositionVector ctpv = ( TermPositionVector ) searcher
                                            .getIndexReader().getTermFreqVector( sdoc.doc,
                                                showField );

                                        if( ctpv != null )
                                        {
                                            TokenStream contentTokenStream = TokenSources
                                                .getTokenStream( ctpv );

                                            highLightContent = highlighter.getBestFragment(
                                                contentTokenStream, showContent );
                                        }
                                    }
                                }

                                if( highLightTitle == null )
                                {
                                    highLightTitle = title;
                                }

                                if( highLightContent == null )
                                {
                                    highLightContent = showContent;
                                }

                                Map infoMap = new HashMap();

                                infoMap.put( "contentId", contentId );

                                infoMap.put( "url", siteBean.getSiteUrl() + "search/link.do?id="
                                    + contentId );

                                infoMap.put( "title", highLightTitle );

                                infoMap.put( "addDate", addDate );

                                if( showContent != null )
                                {
                                    if( "false".equals( light ) )
                                    {
                                        int len = highLightContent.length();

                                        int max = StringUtil.getIntValue( contentLength, 90 );

                                        if( len <= max )
                                        {
                                            infoMap.put( "content", highLightContent );
                                        }
                                        else
                                        {
                                            infoMap.put( "content", StringUtil.subString(
                                                highLightContent, 0, max + 1 ) );
                                        }
                                    }
                                    else
                                    {
                                        infoMap.put( "content", highLightContent );
                                    }
                                }

                                searchDisplyInfoList.add( infoMap );

                            }
                        }
                    }
                    catch ( Exception e )
                    {
                        log.error( e );
                        this.pageContext.setAttribute( "searchResultList", Collections.EMPTY_LIST );
                    }

                    searchTime = ( System.nanoTime() - l1 );
                    ms = MathUtil.div( Double.valueOf( searchTime ).doubleValue(), Double.valueOf(
                        1000000 ).doubleValue(), 0 );

                    searchInfo.put( "time", df2.format( ms / 1000 ) );

                }
                else
                {
                    searchInfo.put( "pageCount", "0" );

                    searchInfo.put( "resultCount", "0" );

                    searchInfo.put( "time", "0" );

                }

                this.pageContext.setAttribute( "searchResultList", searchDisplyInfoList );
            }

            this.pageContext.setAttribute( "SearchInfo", searchInfo );

        }

        if( pageInfo == null )
        {
            pageInfo = new Page( limitVar, 0, 1 );
        }

        this.pageContext.setAttribute( "___system_dispose_page_object___", pageInfo );

        this.pageContext.setAttribute( "keyword", keyVar );
        this.pageContext.setAttribute( "page", Integer.valueOf( page ) );

        if( StringUtil.isStringNotNull( queryKey ) )
        {
            Map keyMap = ( Map ) searchKeyMap.get( siteBean.getSiteId() );

            if( keyMap == null )
            {
                keyMap = new HashMap();

            }

            if( keyMap.get( queryKey ) == null )
            {
                keyMap.put( queryKey, Integer.valueOf( 1 ) );
            }
            else
            {
                keyMap.put( queryKey, Integer.valueOf( ( ( Integer ) keyMap.get( queryKey ) )
                    .intValue() + 1 ) );
            }

            searchKeyMap.put( siteBean.getSiteId(), keyMap );
        }

        return EVAL_BODY_INCLUDE;
    }

    public int doEndTag() throws JspException
    {
        pageContext.removeAttribute( "searchResultList" );
        pageContext.removeAttribute( "SearchInfo" );

        return EVAL_PAGE;
    }

    public void setPageSize( String pageSize )
    {
        this.pageSize = pageSize;
    }

    public void setEnc( String enc )
    {
        this.enc = enc;
    }

    public void setLight( String light )
    {
        this.light = light;
    }

    public void setShowField( String showField )
    {
        this.showField = showField;
    }

    public void setContentLength( String contentLength )
    {
        this.contentLength = contentLength;
    }

    public void setField( String field )
    {
        this.field = field;
    }

    public void setModelId( String modelId )
    {
        this.modelId = modelId;
    }

    public void setClassId( String classId )
    {
        this.classId = classId;
    }

    public void setLeTag( String leTag )
    {
        this.leTag = leTag;
    }

    public void setLsTag( String lsTag )
    {
        this.lsTag = lsTag;
    }

    public void setKey( String key )
    {
        this.key = key;
    }

    public void setPage( String page )
    {
        this.page = page;
    }

    public void setDateEnd( String dateEnd )
    {
        this.dateEnd = dateEnd;
    }

    public void setDateOrder( String dateOrder )
    {
        this.dateOrder = dateOrder;
    }

    public void setDateStart( String dateStart )
    {
        this.dateStart = dateStart;
    }

}
