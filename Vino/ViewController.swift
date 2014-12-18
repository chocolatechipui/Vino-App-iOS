//
//  ViewController.swift
//  WobbaKitViewExample
//
//  Created by Bader on 12/3/14.
//  Copyright (c) 2014 WobbaWobbaWobba. All rights reserved.
//

import UIKit
import WebKit

class ViewController: UIViewController {

    @IBOutlet var webView: UIWebView!

    required init(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let html   = NSBundle.mainBundle().pathForResource("index.html", ofType: "", inDirectory: "Website")
        println(html)
        let url = NSURL.fileURLWithPath(html!) // The html cannot be nil.
        let request = NSURLRequest(URL: url!) // The URL cannot be nil too.

        self.webView.loadRequest(request)

    }
}

