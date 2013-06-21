/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package org.terramagnet.jztree.demo;

import java.util.ArrayList;
import java.util.Collection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.terramagnet.jztree.TypicalJztree;

/**
 * This impl tree's content is meaningness and just for demo. Do not care about it.
 * @author terrason
 */
public class DemoTree extends TypicalJztree<String>{
    private static Logger logger = LoggerFactory.getLogger(DemoTree.class);
    private int deepth=3;
    private int width=3;

    @Override
    public String nodeId(String node) throws IllegalArgumentException {
        return node;
    }

    @Override
    public String nodeParentId(String node) throws IllegalArgumentException {
        return node.length()==1?DEFAULT_ROOT_PID:node.substring(0, node.length()-1);
    }

    @Override
    public String nodeName(String node) throws IllegalArgumentException {
        return "节点-"+node;
    }
    
    @Override
    public Collection<String> listNodes() throws UnsupportedOperationException {
        ArrayList<String> nodes=new ArrayList<String>();
        generateRandomNodes(nodes,"");
        logger.debug("{} nodes generated!",nodes.size());
        return nodes;
    }
    private static final String hexes="ABCDEF";
    private void generateRandomNodes(ArrayList<String> nodes,String parent){
        int level=parent.length()+1;
        for (int i = 0; i < hexes.length(); i++) {
            if(randomInt(width)<i*100){
                break;
            }
            String current=parent+hexes.charAt(i);
            nodes.add(current);
            if(randomInt(level)<deepth*100){
                generateRandomNodes(nodes, current);
            }
        }
    }
    
    private int randomInt(int level){
        return (int)(Math.random()*level*100);
    }

    public int getDeepth() {
        return deepth;
    }

    public void setDeepth(int deepth) {
        this.deepth = deepth;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }
}
