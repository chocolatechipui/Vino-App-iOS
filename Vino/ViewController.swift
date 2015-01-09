//
//  ViewController.swift
//  Vino Hybrid App
//
//  Created by Robert Biggs on 12/3/14.
//  Copyright (c) 2014 Sourcebits. All rights reserved.
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
        
        // Define location of local HTML file:
        let html = NSBundle.mainBundle().pathForResource("index.html", ofType: "", inDirectory: "Website")
        let url = NSURL.fileURLWithPath(html!) // The html cannot be nil.
        let request = NSURLRequest(URL: url!) // The URL cannot be nil too.

        self.webView.loadRequest(request)

    }
}

