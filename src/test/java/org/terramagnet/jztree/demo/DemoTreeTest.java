/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package org.terramagnet.jztree.demo;

import java.util.Collection;
import java.util.Iterator;
import static org.junit.Assert.*;

/**
 *
 * @author terrason
 */
public class DemoTreeTest {
    
    public DemoTreeTest() {
    }

    /**
     * Test of listNodes method, of class DemoTree.
     */
    @org.junit.Test
    public void testListNodes() {
        System.out.println("listNodes");
        DemoTree instance = new DemoTree();
        Collection<String> listNodes = instance.listNodes();
        for (Iterator<String> it = listNodes.iterator(); it.hasNext();) {
            String string = it.next();
            System.out.println(string);
        }
    }
}